import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Cpu, Workflow, BarChart3, Smartphone, Map } from "lucide-react";
import CountUp from "@/components/CountUp";
import FadeUp from "@/components/FadeUp";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#111318] text-white">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-base font-medium tracking-[0.3em]">
              KAI
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/platform" className="text-[13px] text-white hover:text-white/70 transition-colors duration-200">
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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Image
          src={`${basePath}/images/dart/20260223_191335.jpg`}
          alt="DART Platform operations"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-r from-black/15 via-transparent to-black/15" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p
            className="hero-animate text-[11px] font-medium tracking-[0.55em] text-white/40 mb-10 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            KAI Platform
          </p>
          <h1
            className="hero-animate text-[3rem] sm:text-[4.5rem] lg:text-[6rem] xl:text-[7rem] font-thin leading-[0.93] tracking-[-0.03em] mb-10"
            style={{ animationDelay: "160ms" }}
          >
            The operating system<br />
            <span className="text-white/75">for cities and enterprise.</span>
          </h1>
          <p
            className="hero-animate text-lg lg:text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ animationDelay: "360ms" }}
          >
            Kai unifies data, operations, and intelligence into a single platform —
            turning complexity into clarity, at any scale.
          </p>
          <div
            className="hero-animate flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "520ms" }}
          >
            <Link
              href="/contact"
              className="bg-white text-black px-10 py-3.5 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300"
            >
              Request a demo
            </Link>
            <Link
              href="#platform"
              className="border border-white/30 px-10 py-3.5 text-sm font-medium tracking-wide hover:border-white/60 hover:bg-white/[0.04] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Explore the platform <ArrowRight className="w-3.5 h-3.5" />
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

      {/* The Kai Fabric — Three Layers */}
      <section className="py-36 bg-white text-black" id="platform">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">The Kai Fabric</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">
                Three layers.<br />One unified truth.
              </h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="lg:pt-16">
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  Most organizations manage data, operations, and intelligence in silos.
                  Kai dissolves those silos — connecting every data source, every person,
                  and every decision into a single, living operating picture.
                </p>
              </div>
            </FadeUp>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <FadeUp className="h-full">
              <div className="bg-black text-white p-12 h-full">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8">
                  <Database className="w-5 h-5 text-white/50" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-4 uppercase">Layer 01</div>
                <h3 className="text-2xl font-light mb-6">Data Fabric</h3>
                <p className="font-light text-white/50 leading-relaxed text-sm">
                  Every sensor, system, and record unified into one operational truth.
                  IoT streams, workforce data, inspection logs, environmental feeds —
                  all harmonized, all real-time, all in one place.
                </p>
                <div className="mt-10 pt-8 border-t border-white/[0.08] space-y-3">
                  {["IoT & sensor integration", "Legacy system connectors", "Real-time data pipelines", "Open API architecture"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-light text-white/35">
                      <div className="w-1 h-1 bg-white/25 rounded-full shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={120} className="h-full">
              <div className="bg-[#FF6B35] text-white p-12 h-full">
                <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-8">
                  <Workflow className="w-5 h-5 text-white/70" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/50 mb-4 uppercase">Layer 02</div>
                <h3 className="text-2xl font-light mb-6">Operations Layer</h3>
                <p className="font-light text-white/70 leading-relaxed text-sm">
                  Real-time orchestration of people, assets, and workflows.
                  Task routing, staff deployment, incident response — all automated,
                  all traceable, all accountable.
                </p>
                <div className="mt-10 pt-8 border-t border-white/20 space-y-3">
                  {["Automated task routing", "GPS staff tracking", "Incident management", "Workflow automation"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-light text-white/60">
                      <div className="w-1 h-1 bg-white/50 rounded-full shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={240} className="h-full">
              <div className="bg-[#2C3E50] text-white p-12 h-full">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8">
                  <Cpu className="w-5 h-5 text-white/50" />
                </div>
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-4 uppercase">Layer 03</div>
                <h3 className="text-2xl font-light mb-6">Intelligence Engine</h3>
                <p className="font-light text-white/50 leading-relaxed text-sm">
                  AI that predicts demand, routes resources, and learns from every
                  outcome. Not a tool on top of your operations — the brain running
                  through them.
                </p>
                <div className="mt-10 pt-8 border-t border-white/[0.08] space-y-3">
                  {["Predictive demand modeling", "Anomaly detection", "Adaptive ML models", "Decision intelligence"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-light text-white/35">
                      <div className="w-1 h-1 bg-white/25 rounded-full shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-20 border-b border-white/[0.08] pb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/30 mb-6 uppercase">Capabilities</p>
              <div className="grid lg:grid-cols-2 gap-12 items-end">
                <h2 className="text-5xl lg:text-6xl font-thin tracking-[-0.02em]">Six modules.<br />One platform.</h2>
                <p className="text-lg text-white/50 leading-relaxed font-light">
                  From predictive AI to field execution — each module is purpose-built
                  and works as a standalone or as part of the complete Kai stack.
                </p>
              </div>
            </div>
          </FadeUp>

          <div className="grid lg:grid-cols-3 gap-16">
            {[
              {
                num: "01",
                icon: <Cpu className="w-4 h-4" />,
                title: "Predictive AI Engine",
                desc: "Machine learning models forecast cleaning demand, maintenance needs, and staffing requirements up to 4 hours before occurrence. Every prediction improves with each operational cycle.",
                stat: "4 hours",
                statLabel: "Forecast horizon",
              },
              {
                num: "02",
                icon: <BarChart3 className="w-4 h-4" />,
                title: "Real-Time Command Center",
                desc: "Live operational dashboard with full visibility across every asset, station, and team member. GPS tracking, IoT sensor feeds, and instant incident alerting in one unified view.",
                stat: "<30s",
                statLabel: "Alert-to-action",
              },
              {
                num: "03",
                icon: <Map className="w-4 h-4" />,
                title: "Digital Twin",
                desc: "A complete digital replica of every facility under management. 247 inspection checkpoints per station generate compliance-ready audit reports in under 2 minutes.",
                stat: "16,055",
                statLabel: "Mapped checkpoints",
              },
              {
                num: "04",
                icon: <Smartphone className="w-4 h-4" />,
                title: "Mobile Field App",
                desc: "Purpose-built for field crews. Receive tasks, complete inspections, log incidents, and scan assets via QR code — fully offline-capable, zero learning curve.",
                stat: "Offline-ready",
                statLabel: "Connectivity",
              },
              {
                num: "05",
                icon: <Workflow className="w-4 h-4" />,
                title: "Automated Workflows",
                desc: "AI-driven task routing eliminates manual dispatching. Right person, right task, right time — with surge-event protocols that deploy entire teams in under 5 minutes.",
                stat: "<5 min",
                statLabel: "Team deployment",
              },
              {
                num: "06",
                icon: <BarChart3 className="w-4 h-4" />,
                title: "Analytics & Reporting",
                desc: "Executive KPI dashboards and operational reports give leadership full accountability and real-time visibility — from a single station to an entire city network.",
                stat: "24/7",
                statLabel: "Visibility",
              },
            ].map((module, i) => (
              <FadeUp key={module.num} delay={(i % 3) * 120}>
                <div className="group hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-[3.5rem] font-thin text-white/15 leading-none tracking-[-0.02em]">{module.num}</div>
                    <div className="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 group-hover:border-[#FF6B35] group-hover:text-[#FF6B35]">
                      {module.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-light mb-4">{module.title}</h3>
                  <p className="font-light text-white/50 leading-relaxed text-sm">{module.desc}</p>
                  <div className="mt-8 pt-6 border-t border-white/[0.08]">
                    <div className="text-[11px] font-medium text-white/30 tracking-[0.2em] uppercase">{module.statLabel}</div>
                    <div className="text-3xl font-thin mt-2 tracking-[-0.01em]">{module.stat}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 mb-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">Where Kai Operates</p>
              <h2 className="text-5xl lg:text-6xl font-thin leading-tight tracking-[-0.02em]">Built for the world&apos;s most complex environments.</h2>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="flex items-end h-full pb-1">
                <p className="text-lg text-gray-500 leading-relaxed font-light">
                  Kai is deployed where operational failure is not an option — high-traffic, high-stakes,
                  high-complexity environments where real-time intelligence changes outcomes.
                </p>
              </div>
            </FadeUp>
          </div>

          <FadeUp>
            <div className="border-t border-gray-100">
              {[
                { num: "01", industry: "Transit & Cities",      desc: "Rail networks, bus systems, and urban transit — unified operational management across every station, vehicle, and crew.", proof: "65 DART stations live" },
                { num: "02", industry: "Stadiums & Events",     desc: "From daily operations to 100,000-person surge events. FIFA 2026 World Cup deployment across 9 Dallas match days.", proof: "FIFA 2026 ready" },
                { num: "03", industry: "Enterprise Facilities", desc: "Large-scale facility portfolios — corporate campuses, convention centers, mixed-use real estate — all in one operating picture.", proof: "Enterprise-grade" },
                { num: "04", industry: "Healthcare",            desc: "Hospital environments where compliance, cleanliness, and response time are mission-critical. Continuous inspection and accountability.", proof: "HIPAA-compatible" },
                { num: "05", industry: "Energy & Utilities",    desc: "Maintenance scheduling, asset inspection, and predictive failure detection for critical infrastructure.", proof: "Critical infrastructure" },
              ].map((item) => (
                <div key={item.industry} className="grid lg:grid-cols-12 gap-8 border-b border-gray-100 py-10">
                  <div className="lg:col-span-1 text-2xl font-thin text-gray-200 tracking-[-0.01em]">{item.num}</div>
                  <div className="lg:col-span-3">
                    <h3 className="text-xl font-light">{item.industry}</h3>
                  </div>
                  <div className="lg:col-span-6">
                    <p className="text-lg font-light text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="lg:col-span-2 text-right">
                    <span className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">{item.proof}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How Kai Works */}
      <section className="py-36 bg-[#111318]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="lg:sticky lg:top-24">
              <FadeUp>
                <p className="text-[11px] font-medium tracking-[0.3em] text-white/30 mb-6 uppercase">The Feedback Loop</p>
                <h2 className="text-5xl font-thin mb-8 tracking-[-0.02em]">From raw data to<br />field action in<br />&lt;30 seconds.</h2>
                <p className="text-lg text-white/50 leading-relaxed mb-12 font-light">
                  A closed-loop system that doesn&apos;t just react — it anticipates.
                  Every action feeds back into the model, making Kai sharper with
                  every event, every inspection, every deployment.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
                >
                  See a live demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </FadeUp>
            </div>
            <div className="space-y-0">
              {[
                {
                  step: "01",
                  title: "Ingest",
                  desc: "IoT sensors, turnstile counts, GPS positions, inspection records, workforce schedules, and third-party system feeds stream into Kai continuously — with no manual data entry required.",
                  metric: "Real-time",
                },
                {
                  step: "02",
                  title: "Analyze",
                  desc: "ML models process every incoming signal. Anomalies are detected. Demand is forecast. Patterns are identified across your entire operational footprint, not just a single location.",
                  metric: "<500ms latency",
                },
                {
                  step: "03",
                  title: "Decide",
                  desc: "The intelligence layer generates prioritized actions — dispatching the right person, escalating the right alert, triggering the right workflow — automatically, based on role, location, and priority.",
                  metric: "AI-automated",
                },
                {
                  step: "04",
                  title: "Execute",
                  desc: "Field crews receive tasks on mobile, complete inspections, and close work orders. Every action is logged, timestamped, and fed back into the model — tightening the loop with every cycle.",
                  metric: "Full audit trail",
                },
              ].map((item, i) => (
                <FadeUp key={item.step} delay={i * 100}>
                  <div className="grid grid-cols-[56px_1fr_auto] gap-6 items-start py-10 border-b border-white/[0.08]">
                    <div className="text-[11px] font-medium text-white/20 tracking-[0.2em] pt-1">{item.step}</div>
                    <div>
                      <h3 className="text-2xl font-light mb-3">{item.title}</h3>
                      <p className="font-light text-white/40 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                    <div className="text-right pt-1">
                      <span className="text-[11px] font-medium text-white/20 tracking-[0.15em] uppercase whitespace-nowrap">{item.metric}</span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Numbers */}
      <section className="py-36 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp>
            <div className="mb-20">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-6 uppercase">Measured Outcomes</p>
              <h2 className="text-5xl font-thin tracking-[-0.02em]">Numbers that matter.</h2>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">AI prediction accuracy</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={94.2} decimals={1} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Reduction in downtime</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={60} suffix="%" /></div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Alert-to-action</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]">&lt;30s</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase mb-3">Days to go-live</div>
                <div className="text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]"><CountUp end={30} /></div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <div className="border-t border-gray-100 pt-16 grid lg:grid-cols-2 gap-x-20">
              {[
                { label: "Stations under management",   value: <CountUp end={65} /> },
                { label: "Total inspection points",     value: <CountUp end={16055} /> },
                { label: "Inspection points / station", value: <CountUp end={247} /> },
                { label: "Report generation time",      value: "<2 min" },
                { label: "Team deployment time",        value: "<5 min" },
                { label: "Platform uptime SLA",         value: <CountUp end={99.9} decimals={1} suffix="%" /> },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-baseline border-b border-gray-100 py-5">
                  <span className="text-[12px] text-gray-400 tracking-wide">{row.label}</span>
                  <span className="text-2xl font-thin tracking-[-0.01em]">{row.value}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-36 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <FadeUp>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/30 mb-6 uppercase">Technical Foundation</p>
              <h2 className="text-5xl font-thin mb-8 tracking-[-0.02em]">Enterprise-grade.<br />Day-one ready.</h2>
              <p className="text-xl text-white/50 leading-relaxed mb-6 font-light">
                Cloud-native open architecture. Kai integrates with your existing
                OCC, GIS, HR, ERP, and security systems — no rip-and-replace,
                no years-long implementation.
              </p>
              <p className="text-lg text-white/35 leading-relaxed mb-12 font-light">
                From contract to live operations in 30 days.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
              >
                Discuss your integration
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </FadeUp>
            <FadeUp delay={160}>
              <div className="space-y-0">
                {[
                  { label: "Deployment",    value: "Cloud-native (Azure / AWS)" },
                  { label: "Uptime SLA",    value: "99.9% guaranteed" },
                  { label: "Data latency",  value: "<500ms end-to-end" },
                  { label: "API protocol",  value: "REST & WebSocket" },
                  { label: "Mobile OS",     value: "iOS 16+ / Android 13+" },
                  { label: "Security",      value: "SOC 2 Type II · AES-256" },
                  { label: "Compliance",    value: "FTA · NIST 800-53" },
                  { label: "Go-live time",  value: "30 days" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-baseline border-b border-white/[0.07] py-5">
                    <span className="text-[12px] text-white/35 tracking-wide">{row.label}</span>
                    <span className="text-lg font-light">{row.value}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-44 bg-black border-t border-white/[0.06]">
        <FadeUp>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-[11px] font-medium tracking-[0.4em] text-white/30 mb-10 uppercase">Ready to See It</p>
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
                href="/world-cup-2026"
                className="border border-white/20 px-12 py-4 text-sm font-medium tracking-wide hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                FIFA 2026 deployment
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
