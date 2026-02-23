import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic2, Volume2, Download, Zap, ArrowRight, Star, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Dalsi Voice
            </span>
          </div>
          <Link href="/generator">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
              Try Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4">
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-200 font-medium">
              ✨ Professional Text-to-Speech
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Transform Text
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Into Natural Speech
            </span>
          </h1>
          
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create professional audio content with multiple accents, genders, and voice types. Perfect for videos, podcasts, and presentations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-xl">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-purple-500/20">
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-2">7+</div>
              <p className="text-purple-200">Voice Profiles</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-2">5</div>
              <p className="text-purple-200">English Accents</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-300 mb-2">3</div>
              <p className="text-purple-200">Gender Options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Premium Features
              </span>
            </h2>
            <p className="text-purple-200 text-lg">Everything you need for professional voice generation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Volume2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multiple Accents</h3>
              <p className="text-purple-200">
                Choose from US, UK, Australian, Indian, and more. Each accent is professionally crafted for authenticity.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Voice Variety</h3>
              <p className="text-purple-200">
                Select from male, female, and non-binary voices with different tones: young, mature, professional, or casual.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Easy Download</h3>
              <p className="text-purple-200">
                Download your generated audio in MP3 or WAV format. Perfect for videos, podcasts, and presentations.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Generation</h3>
              <p className="text-purple-200">
                Generate professional audio in seconds. No complex settings or technical knowledge required.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Premium Quality</h3>
              <p className="text-purple-200">
                High-quality audio output suitable for professional use in videos, podcasts, and commercial projects.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 p-8 backdrop-blur group cursor-pointer">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Always Improving</h3>
              <p className="text-purple-200">
                We continuously add new voices, accents, and features to keep Dalsi Voice at the cutting edge.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12 md:p-16 text-center backdrop-blur">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create?
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Start generating professional voice content today. Free, fast, and easy to use.
            </p>
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50">
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur py-12 px-4 relative z-10">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Mic2 className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-purple-300">Dalsi Voice</span>
            </div>
            <p className="text-sm text-purple-300/70">
              © 2026 Dalsi Voice. All rights reserved. | dalsivoice.io
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
