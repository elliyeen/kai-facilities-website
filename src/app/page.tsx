import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import WorldCupCountdown from "@/components/WorldCupCountdown";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const daysUntilWorldCup = Math.ceil(
  (new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-light tracking-wider">
              KAI
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/platform" className="text-sm font-light hover:text-white/70 transition">
                PLATFORM
              </Link>
              <Link href="/world-cup-2026" className="text-sm font-light hover:text-white/70 transition">
                FIFA 2026
              </Link>
              <Link href="/contact" className="text-sm font-light border border-white px-6 py-2 hover:bg-white hover:text-black transition">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Full Screen */}
      <section className="h-screen flex items-center justify-center relative">
        <Image
          src={`${basePath}/images/dart/parkeroad.jpg`}
          alt="DART Parker Road Station"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl lg:text-8xl font-light mb-8 tracking-tight">
            AI-Powered<br />Facility Intelligence
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/80 mb-12 max-w-2xl mx-auto">
            Preparing Dallas transit infrastructure for FIFA World Cup 2026
          </p>
          <Link
            href="/contact"
            className="inline-block border border-white px-8 py-4 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
          >
            REQUEST DEMO
          </Link>
        </div>
      </section>

      {/* World Cup Countdown */}
      <WorldCupCountdown />

      {/* Data Section - Tufte Style */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl font-light mb-8">The Challenge</h2>
              <p className="text-xl font-light text-gray-600 leading-relaxed">
                FIFA World Cup 2026 will bring unprecedented demand to Dallas transit infrastructure.
                DART must prepare for a 300% surge in daily ridership with zero tolerance for failure.
              </p>
            </div>
            <div>
              {/* Minimal Data Visualization */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-light text-gray-500">NORMAL OPERATIONS</span>
                    <span className="text-4xl font-light">35,000</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-light text-gray-500">MATCH DAY DEMAND</span>
                    <span className="text-4xl font-light">100,000+</span>
                  </div>
                  <div className="h-px bg-black"></div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-light text-gray-500">SURGE CAPACITY</span>
                    <span className="text-4xl font-light">+286%</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-light text-gray-500">DAYS UNTIL WORLD CUP</span>
                    <span className="text-4xl font-light">{daysUntilWorldCup}</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Station Inventory Section */}
      <section className="py-32 bg-white text-black border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-light mb-8">Station Inventory<br />& Inspection System</h2>
              <p className="text-xl font-light text-gray-600 leading-relaxed mb-8">
                Every DART station fully inventoried and inspection-ready.
                Complete digital twin of all 73 stations with real-time status tracking.
              </p>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 border-b border-gray-200 pb-3">
                  <span className="text-4xl font-light">247</span>
                  <span className="text-sm font-light text-gray-500">Inspection points per station</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-gray-200 pb-3">
                  <span className="text-4xl font-light">18,031</span>
                  <span className="text-sm font-light text-gray-500">Total inspection points (73 stations)</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-gray-200 pb-3">
                  <span className="text-4xl font-light">&lt;2min</span>
                  <span className="text-sm font-light text-gray-500">Time to generate inspection report</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-light text-gray-500 mb-2">TRACKED ASSETS PER STATION</h3>
                <ul className="space-y-2 text-lg font-light">
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Platforms & Track Areas</span>
                    <span className="text-gray-400">12 zones</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Restrooms & Facilities</span>
                    <span className="text-gray-400">8 locations</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Escalators & Elevators</span>
                    <span className="text-gray-400">4-6 units</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Lighting Systems</span>
                    <span className="text-gray-400">89 fixtures</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Signage & Wayfinding</span>
                    <span className="text-gray-400">34 signs</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Security Cameras</span>
                    <span className="text-gray-400">16 units</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Emergency Equipment</span>
                    <span className="text-gray-400">12 systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform - Minimal */}
      <section className="relative py-32 bg-black overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260223_191335.jpg`}
          alt="DART Platform"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl font-light mb-20">Platform</h2>

          <div className="grid lg:grid-cols-3 gap-16">
            <div>
              <div className="text-7xl font-light mb-4">01</div>
              <h3 className="text-2xl font-light mb-4">Predictive AI</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Machine learning models forecast maintenance needs 4 hours ahead,
                automatically adjusting staffing and resource allocation.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">ACCURACY</div>
                <div className="text-3xl font-light mt-1">94.2%</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">02</div>
              <h3 className="text-2xl font-light mb-4">Real-Time Analytics</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Live command center with instant visibility across all 64 DART stations,
                monitoring staff locations and facility status via GPS and IoT sensors.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">RESPONSE TIME</div>
                <div className="text-3xl font-light mt-1">&lt;30s</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">03</div>
              <h3 className="text-2xl font-light mb-4">Automated Workflows</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Intelligent task routing and resource optimization powered by AI algorithms,
                deploying rapid response teams in under 5 minutes.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">DEPLOYMENT</div>
                <div className="text-3xl font-light mt-1">&lt;5min</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics - Data Dense */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl font-light mb-20">Performance</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="text-6xl font-light mb-2">60%</div>
              <div className="text-sm font-light text-gray-500">DOWNTIME REDUCTION</div>
            </div>
            <div>
              <div className="text-6xl font-light mb-2">100%</div>
              <div className="text-sm font-light text-gray-500">REAL-TIME VISIBILITY</div>
            </div>
            <div>
              <div className="text-6xl font-light mb-2">40%</div>
              <div className="text-sm font-light text-gray-500">FASTER RESPONSE</div>
            </div>
            <div>
              <div className="text-6xl font-light mb-2">24/7</div>
              <div className="text-sm font-light text-gray-500">MONITORING</div>
            </div>
          </div>

          <div className="mt-20 pt-20 border-t border-gray-200">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h3 className="text-3xl font-light mb-6">Built for Scale</h3>
                <p className="text-lg font-light text-gray-600 leading-relaxed mb-8">
                  Our platform has been tested on transit systems handling similar surge events,
                  successfully managing 200%+ capacity increases with zero service degradation.
                </p>
                <Link
                  href="/platform"
                  className="inline-flex items-center text-sm font-light border-b border-black pb-1 hover:border-gray-400 transition"
                >
                  EXPLORE PLATFORM
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <span className="text-sm font-light text-gray-500">DART STATIONS</span>
                  <span className="text-2xl font-light">73</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <span className="text-sm font-light text-gray-500">DART LIGHT RAIL VEHICLES</span>
                  <span className="text-2xl font-light">163</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <span className="text-sm font-light text-gray-500">INSPECTION POINTS / STATION</span>
                  <span className="text-2xl font-light">247</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2">
                  <span className="text-sm font-light text-gray-500">REAL-TIME MONITORING</span>
                  <span className="text-2xl font-light">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-32 bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-light mb-8">
            Ready for FIFA 2026?
          </h2>
          <p className="text-xl font-light text-white/60 mb-12">
            {daysUntilWorldCup} days to prepare DART for the world's biggest event
          </p>
          <Link
            href="/contact"
            className="inline-block border border-white px-10 py-5 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
          >
            REQUEST PILOT PROGRAM
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-sm font-light text-white/40">
              © 2024 KAI. AI-Powered Facility Intelligence.
            </div>
            <div className="flex gap-8">
              <Link href="/platform" className="text-sm font-light text-white/40 hover:text-white transition">
                Platform
              </Link>
              <Link href="/world-cup-2026" className="text-sm font-light text-white/40 hover:text-white transition">
                FIFA 2026
              </Link>
              <Link href="/contact" className="text-sm font-light text-white/40 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
