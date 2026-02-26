import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Workflow, Cpu } from "lucide-react";
import WorldCupCountdown from "@/components/WorldCupCountdown";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-light tracking-wider">
              KAI
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/platform" className="text-sm font-light text-white/60 hover:text-white transition">
                PLATFORM
              </Link>
              <Link href="/world-cup-2026" className="text-sm font-light text-white/60 hover:text-white transition">
                FIFA 2026
              </Link>
              <Link href="/#about" className="text-sm font-light text-white/60 hover:text-white transition">
                ABOUT
              </Link>
              <Link href="/contact" className="text-sm font-light border border-white px-6 py-2 hover:bg-white hover:text-black transition">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <Image
          src={`${basePath}/images/dart/parkeroad.jpg`}
          alt="City infrastructure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black"></div>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }}></div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-sm font-light tracking-[0.4em] text-white/40 mb-8 uppercase">Kai</p>
          <h1 className="text-6xl lg:text-8xl font-light mb-8 tracking-tight leading-none">
            The Operating System<br />
            <span className="text-white/60">for Cities and Enterprise.</span>
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/60 mb-16 max-w-3xl mx-auto leading-relaxed">
            Data, operations, and intelligence — unified into one platform.
            From a single transit station to an entire city network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/platform"
              className="inline-block bg-white text-black px-10 py-4 text-sm font-light tracking-wide hover:bg-white/90 transition"
            >
              EXPLORE THE PLATFORM
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-white/30 px-10 py-4 text-sm font-light tracking-wide hover:border-white hover:bg-white/5 transition"
            >
              REQUEST DEMO
            </Link>
          </div>
        </div>
      </section>

      {/* The Kai Fabric */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">How It Works</p>
              <h2 className="text-5xl lg:text-6xl font-light leading-tight">
                Three layers.<br />One unified truth.
              </h2>
            </div>
            <div>
              <p className="text-xl font-light text-gray-500 leading-relaxed">
                Most organizations manage data, operations, and intelligence in silos.
                Kai dissolves those silos — connecting every source, every person,
                and every decision into a single living operating picture.
              </p>
              <Link
                href="/platform"
                className="inline-flex items-center mt-8 text-sm font-light border-b border-black pb-1 hover:border-gray-400 transition gap-2"
              >
                SEE THE FULL PLATFORM
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <div className="bg-black text-white p-10">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8">
                <Database className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/30 mb-3 uppercase">Layer 01</div>
              <h3 className="text-xl font-light mb-4">Data Fabric</h3>
              <p className="text-sm font-light text-white/50 leading-relaxed">
                Every sensor, system, and record unified into one operational truth.
                IoT streams, workforce data, and inspection logs — all harmonized, all real-time.
              </p>
            </div>
            <div className="bg-[#FF6B35] text-white p-10">
              <div className="w-10 h-10 border border-white/30 flex items-center justify-center mb-8">
                <Workflow className="w-4 h-4 text-white/70" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/50 mb-3 uppercase">Layer 02</div>
              <h3 className="text-xl font-light mb-4">Operations Layer</h3>
              <p className="text-sm font-light text-white/70 leading-relaxed">
                Real-time orchestration of people, assets, and workflows.
                Task routing, staff deployment, incident response — all automated and accountable.
              </p>
            </div>
            <div className="bg-[#2C3E50] text-white p-10">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8">
                <Cpu className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/30 mb-3 uppercase">Layer 03</div>
              <h3 className="text-xl font-light mb-4">Intelligence Engine</h3>
              <p className="text-sm font-light text-white/50 leading-relaxed">
                AI that predicts demand, routes resources, and learns from every outcome.
                Not a tool on top of operations — the brain running through them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof in Action — DART & FIFA 2026 */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">Live Deployment</p>
              <h2 className="text-5xl font-light leading-tight">
                Kai is live across<br />65 DART stations<br />today.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-xl font-light text-white/50 leading-relaxed mb-8">
                The Dallas Area Rapid Transit network is our proving ground.
                16,055 inspection points across 93 miles of light rail, and the world's
                biggest sporting event bearing down in {Math.ceil((new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.
              </p>
              <Link
                href="/world-cup-2026"
                className="inline-flex items-center text-sm font-light border-b border-white pb-1 hover:border-white/40 transition gap-2"
              >
                FIFA 2026 DEPLOYMENT
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20 border-t border-white/10 pt-20">
            {[
              { value: "65",      label: "DART STATIONS" },
              { value: "16,055", label: "INSPECTION POINTS" },
              { value: "94.2%",  label: "AI ACCURACY" },
              { value: "<30s",   label: "ALERT-TO-ACTION" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-5xl lg:text-6xl font-light mb-3">{s.value}</div>
                <div className="text-xs font-light text-white/30 tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Match day data */}
          <div className="border-t border-white/10 pt-16 grid lg:grid-cols-2 gap-x-20">
            {[
              { label: "NORMAL DAILY RIDERSHIP",     value: "35,000" },
              { label: "MATCH DAY DEMAND",            value: "100,000+" },
              { label: "SURGE CAPACITY",              value: "+286%" },
              { label: "STAFF DEPLOYMENT TIME",       value: "<5 min" },
              { label: "REPORT GENERATION",           value: "<2 min" },
              { label: "PLATFORM UPTIME SLA",         value: "99.9%" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-baseline border-b border-white/10 py-5">
                <span className="text-xs font-light text-white/30 tracking-widest">{row.label}</span>
                <span className="text-2xl font-light">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Cup Countdown */}
      <WorldCupCountdown />

      {/* Platform — Image backed */}
      <section className="relative py-32 bg-black overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260223_191335.jpg`}
          alt="DART Platform operations"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/80"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">Capabilities</p>
            <h2 className="text-5xl font-light">Six modules. One platform.</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              { num: "01", title: "Predictive AI Engine",       stat: "94.2%", label: "ACCURACY",       desc: "ML models forecast demand up to 4 hours ahead — maintenance, staffing, and resource allocation, automatically." },
              { num: "02", title: "Real-Time Command Center",    stat: "<30s",  label: "RESPONSE",       desc: "Live dashboard across every asset and team member. GPS tracking, IoT sensors, and instant incident alerting." },
              { num: "03", title: "Automated Workflows",         stat: "<5min", label: "DEPLOYMENT",     desc: "AI-driven task routing deploys the right person to the right task — surge protocols included." },
            ].map((item) => (
              <div key={item.num}>
                <div className="text-6xl font-light text-white/20 mb-4">{item.num}</div>
                <h3 className="text-xl font-light mb-4">{item.title}</h3>
                <p className="text-sm font-light text-white/50 leading-relaxed">{item.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs font-light text-white/30 tracking-widest">{item.label}</div>
                  <div className="text-3xl font-light mt-2">{item.stat}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-16 border-t border-white/10">
            <Link
              href="/platform"
              className="inline-flex items-center text-sm font-light border-b border-white pb-1 hover:border-white/40 transition gap-2"
            >
              VIEW ALL SIX MODULES
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 mb-24">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">About Kai</p>
              <h2 className="text-5xl font-light leading-tight">
                The organic<br />improvement of<br />the spaces we share.
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-xl font-light text-gray-500 leading-relaxed">
                Good spaces don't happen by accident. They're built by people who care,
                running systems that never stop learning — steadily raising the quality
                of every environment people move through together.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 pt-20 border-t border-gray-200">
            {[
              {
                num: "01",
                title: "The Human Experience",
                body: "We work with what's already there — the stations, routes, and infrastructure millions depend on — and we make them better, from the inside out. Every tool exists to serve the person moving through the space, not the system managing it.",
              },
              {
                num: "02",
                title: "Empowering People",
                body: "The people maintaining these spaces already know what's wrong. They need better tools, cleaner data, and systems that respect their expertise. When frontline teams have what they need, the spaces they care for reflect it.",
              },
              {
                num: "03",
                title: "Continuous Improvement",
                body: "Great spaces aren't finished — they evolve. Real-world data tells us what's working, what isn't, and where to go next. The goal isn't perfection. It's a relentless, honest pursuit of better.",
              },
            ].map((item) => (
              <div key={item.num}>
                <div className="text-6xl font-light text-gray-200 mb-4">{item.num}</div>
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="font-light text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-light tracking-[0.4em] text-white/30 mb-8 uppercase">Get Started</p>
          <h2 className="text-5xl lg:text-7xl font-light mb-8 leading-none">
            See Kai in action.
          </h2>
          <p className="text-xl font-light text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed">
            A 60-minute live demo — command center walkthrough, AI prediction
            simulation, and a FIFA 2026 surge-event scenario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-12 py-5 text-sm font-light tracking-wide hover:bg-white/90 transition"
            >
              REQUEST LIVE DEMO
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center justify-center border border-white/20 px-12 py-5 text-sm font-light tracking-wide hover:border-white/60 transition gap-2"
            >
              EXPLORE PLATFORM
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-sm font-light text-white/40">
              © {new Date().getFullYear()} KAI. The Operating System for Cities and Enterprise.
            </div>
            <div className="flex gap-8">
              <Link href="/platform" className="text-sm font-light text-white/40 hover:text-white transition">Platform</Link>
              <Link href="/world-cup-2026" className="text-sm font-light text-white/40 hover:text-white transition">FIFA 2026</Link>
              <Link href="/contact" className="text-sm font-light text-white/40 hover:text-white transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
