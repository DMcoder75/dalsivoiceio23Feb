import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllVoiceProfiles,
  getVoiceProfileById,
  createOrGetUserSession,
  getUserSessionByToken,
  incrementGenerationCount,
  createGenerationRecord,
  getVoiceSampleByProfileId,
  getOrCreateVoiceSample,
} from "./db";
import { generateSpeech, generateVoiceSample } from "./tts";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  voice: router({
    getAllProfiles: publicProcedure.query(async () => {
      const profiles = await getAllVoiceProfiles();
      
      // Fetch voice samples for each profile
      const profilesWithSamples = await Promise.all(
        profiles.map(async (profile) => {
          const sample = await getVoiceSampleByProfileId(profile.id);
          return {
            ...profile,
            sampleAudioUrl: sample?.audioUrl || null,
          };
        })
      );

      return profilesWithSamples;
    }),

    getProfile: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const profile = await getVoiceProfileById(input.id);
        if (!profile) return null;

        const sample = await getVoiceSampleByProfileId(input.id);
        return {
          ...profile,
          sampleAudioUrl: sample?.audioUrl || null,
        };
      }),

    // Generate voice sample for a profile (admin/internal use)
    generateSample: publicProcedure
      .input(z.object({ voiceProfileId: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const profile = await getVoiceProfileById(input.voiceProfileId);
          if (!profile) {
            throw new Error("Voice profile not found");
          }

          // Check if sample already exists
          const existing = await getVoiceSampleByProfileId(input.voiceProfileId);
          if (existing) {
            return {
              success: true,
              audioUrl: existing.audioUrl,
              message: "Sample already exists",
            };
          }

          // Generate new sample
          const audioUrl = await generateVoiceSample(input.voiceProfileId);
          
          // Store in database
          await getOrCreateVoiceSample(
            input.voiceProfileId,
            audioUrl,
            `Sample for ${profile.name}`
          );

          return {
            success: true,
            audioUrl,
            message: "Sample generated successfully",
          };
        } catch (error) {
          console.error("Sample generation error:", error);
          throw new Error(
            `Failed to generate sample: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }),

    initSession: publicProcedure.mutation(async () => {
      // Create a temporary session for non-authenticated users
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { sessionToken };
    }),

    getSession: publicProcedure
      .input(z.object({ sessionToken: z.string() }).optional())
      .query(async () => {
        return {
          generationCount: 0,
          remainingGenerations: 2,
          canGenerate: true,
        };
      }),

    generate: publicProcedure
      .input(
        z.object({
          text: z.string().min(1).max(5000),
          voiceProfileId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Validate voice profile
          const voiceProfile = await getVoiceProfileById(input.voiceProfileId);
          if (!voiceProfile) {
            throw new Error("Voice profile not found");
          }

          // Generate speech using Google Cloud TTS
          const audioUrl = await generateSpeech(input.text, input.voiceProfileId);

          return {
            success: true,
            audioUrl,
            voiceProfile,
          };
        } catch (error) {
          console.error("Generation error:", error);
          throw new Error(
            `Failed to generate speech: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }),

    // Health check endpoint
    health: publicProcedure.query(() => {
      return { status: "ok", timestamp: new Date() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
