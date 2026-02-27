import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Workflow, Cpu } from "lucide-react";
import WorldCupCountdown from "@/components/WorldCupCountdown";
import FadeUp from "@/components/FadeUp";
import CountUp from "@/components/CountUp";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-base font-medium tracking-[0.3em]">
              KAI
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/platform" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                Platform
              </Link>
              <Link href="/world-cup-2026" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                FIFA 2026
              </Link>
              <Link href="/#about" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                About
              </Link>
            </div>
            <Link
              href="/contact"
              className="text-[13px] border border-white/20 px-5 py-2 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Image
          src={`${basePath}/images/dart/parkeroad.jpg`}
          alt="City infrastructure"
          fill
          className="object-cover"
          priority
        />
        {/* Cinematic gradient — reveals image through the center */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-r from-black/15 via-transparent to-black/15" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <p
            className="hero-animate text-[11px] font-medium tracking-[0.55em] text-white/40 mb-10 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            KAI
          </p>
          <h1
            className="hero-animate text-[3.2rem] sm:text-[4.8rem] lg:text-[6.5rem] xl:text-[7.5rem] font-thin leading-[0.93] tracking-[-0.03em] mb-10"
            style={{ animationDelay: "160ms" }}
          >
            The operating system<br />
            <span className="text-white/75">for cities.</span>
          </h1>
          <p
            className="hero-animate text-lg lg:text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ animationDelay: "360ms" }}
          >
            Data, operations, and intelligence, unified.
          </p>
          <div
            className="hero-animate flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "520ms" }}
          >
            <Link
              href="/platform"
              className="bg-white text-black px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
            >
              Explore the Platform
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 px-10 py-3.5 text-sm font-medium tracking-wide hover:border-white/60 hover:bg-white/[0.04] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Request a demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scroll line */}
        <div
          className="hero-animate absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ animationDelay: "900ms" }}
        >
          <div className="w-px h-14 bg-linear-to-b from-white/25 to-transparent mx-auto" />
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-[11px] text-gray-400 tracking-[0.2em] uppercase">
          <span>DART Authority</span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span>FIFA World Cup 2026</span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span>AT&amp;T Stadium, Arlington</span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span>65 Live Stations</span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span>16,055 Inspection Points</span>
        </div>
      </div>

      {/* The Kai Fabric */}
      <section className="py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">How It Works</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                Three layers.<br />One unified truth.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <p className="text-xl text-gray-500 leading-relaxed font-light">
                Most organizations manage data, operations, and intelligence in silos.
                Kai dissolves those silos — connecting every source, every person,
                and every decision into a single living operating picture.
              </p>
              <Link
                href="/platform"
                className="inline-flex items-center mt-8 text-sm font-medium border-b border-black pb-1 hover:border-gray-400 transition-colors duration-200 gap-2"
              >
                See the full platform
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <FadeUp className="h-full">
              <div className="bg-black text-white p-10 h-full">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8">
                  <Database className="w-4 h-4 text-white/40" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-3 uppercase">Layer 01</div>
                <h3 className="text-xl font-light mb-4">Data Fabric</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  Every sensor, system, and record unified into one operational truth.
                  IoT streams, workforce data, and inspection logs — all harmonized, all real-time.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={120} className="h-full">
              <div className="bg-[#FF6B35] text-white p-10 h-full">
                <div className="w-10 h-10 border border-white/30 flex items-center justify-center mb-8">
                  <Workflow className="w-4 h-4 text-white/60" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/50 mb-3 uppercase">Layer 02</div>
                <h3 className="text-xl font-light mb-4">Operations Layer</h3>
                <p className="text-sm text-white/70 leading-relaxed font-light">
                  Real-time orchestration of people, assets, and workflows.
                  Task routing, staff deployment, incident response — all automated and accountable.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={240} className="h-full">
              <div className="bg-[#2C3E50] text-white p-10 h-full">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center mb-8">
                  <Cpu className="w-4 h-4 text-white/40" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-3 uppercase">Layer 03</div>
                <h3 className="text-xl font-light mb-4">Intelligence Engine</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  AI that predicts demand, routes resources, and learns from every outcome.
                  Not a tool on top of operations — the brain running through them.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Proof in Action */}
      <section className="py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/50 mb-6 uppercase">Live Deployment</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                Kai is live across<br />65 DART stations<br />today.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="lg:pt-16">
                <p className="text-xl text-white/65 leading-relaxed mb-8 font-light">
                  The Dallas Area Rapid Transit network is our proving ground.
                  16,055 inspection points across 93 miles of light rail, and the world&apos;s
                  biggest sporting event bearing down in {Math.ceil((new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days.
                </p>
                <Link
                  href="/world-cup-2026"
                  className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
                >
                  FIFA 2026 deployment
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Stats */}
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/10 pt-20">
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">DART Stations</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={65} /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">Inspection Points</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={16055} /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">AI Accuracy</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={94.2} decimals={1} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase mb-3">Alert-to-Action</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]">&lt;30s</div>
              </div>
            </div>
          </FadeUp>

          {/* Match day data */}
          <FadeUp delay={200}>
            <div className="border-t border-white/[0.08] pt-16 mt-20 grid lg:grid-cols-2 gap-x-20">
              {[
                { label: "Normal daily ridership",  value: "35,000" },
                { label: "Match day demand",         value: "100,000+" },
                { label: "Surge capacity",           value: "+286%" },
                { label: "Staff deployment time",    value: "<5 min" },
                { label: "Report generation",        value: "<2 min" },
                { label: "Platform uptime SLA",      value: "99.9%" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-white/10 py-5">
                  <span className="text-[12px] text-white/50 tracking-wide">{row.label}</span>
                  <span className="text-2xl font-thin tracking-[-0.01em]">{row.value}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* World Cup Countdown */}
      <WorldCupCountdown />

      {/* Platform — Image backed */}
      <section className="relative py-36 bg-[#111318] overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260223_191335.jpg`}
          alt="DART Platform operations"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#111318]/80 via-[#111318]/30 to-[#111318]/80" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/30 mb-6 uppercase">Capabilities</p>
              <h2 className="text-5xl lg:text-6xl font-thin tracking-[-0.02em]">Six modules. One platform.</h2>
            </div>
          </FadeUp>
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              { num: "01", title: "Predictive AI Engine",     stat: "94.2%", label: "Accuracy",   desc: "ML models forecast demand up to 4 hours ahead — maintenance, staffing, and resource allocation, automatically." },
              { num: "02", title: "Real-Time Command Center", stat: "<30s",  label: "Response",   desc: "Live dashboard across every asset and team member. GPS tracking, IoT sensors, and instant incident alerting." },
              { num: "03", title: "Automated Workflows",      stat: "<5min", label: "Deployment", desc: "AI-driven task routing deploys the right person to the right task — surge protocols included." },
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 120}>
                <div className="text-[4rem] font-thin text-white/15 mb-4 leading-none tracking-[-0.02em]">{item.num}</div>
                <h3 className="text-lg font-light mb-4">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed font-light">{item.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-[11px] font-medium text-white/50 tracking-[0.2em] uppercase">{item.label}</div>
                  <div className="text-3xl font-thin mt-2 tracking-[-0.01em]">{item.stat}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={100}>
            <div className="mt-20 pt-16 border-t border-white/[0.08]">
              <Link
                href="/platform"
                className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
              >
                View all six modules
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">About Kai</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                The organic<br />improvement of<br />the spaces we share.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="flex items-end h-full pb-1">
                <p className="text-xl text-gray-500 leading-relaxed font-light">
                  Good spaces don&apos;t happen by accident. They&apos;re built by people who care,
                  running systems that never stop learning — steadily raising the quality
                  of every environment people move through together.
                </p>
              </div>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-16 pt-20 border-t border-gray-100">
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
            ].map((item, i) => (
              <FadeUp key={item.num} delay={i * 120}>
                <div className="text-[4rem] font-thin text-gray-100 mb-4 leading-none tracking-[-0.02em]">{item.num}</div>
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light">{item.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-44 bg-[#111318] border-t border-white/[0.06]">
        <FadeUp>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[11px] font-medium tracking-[0.4em] text-white/50 mb-10 uppercase">Get Started</p>
            <h2 className="text-5xl lg:text-7xl xl:text-[6rem] font-thin mb-8 leading-none tracking-[-0.03em]">
              See Kai in action.
            </h2>
            <p className="text-xl text-white/45 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              A 60-minute live demo — command center walkthrough, AI prediction
              simulation, and a FIFA 2026 surge-event scenario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-black px-12 py-4 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                Request a live demo
              </Link>
              <Link
                href="/platform"
                className="border border-white/20 px-12 py-4 text-sm font-medium tracking-wide hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Explore platform
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-[13px] text-white/30">
              © {new Date().getFullYear()} KAI — The Operating System for Cities and Enterprise.
            </div>
            <div className="flex gap-8">
              <Link href="/platform" className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200">Platform</Link>
              <Link href="/world-cup-2026" className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200">FIFA 2026</Link>
              <Link href="/#about" className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200">About</Link>
              <Link href="/contact" className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
