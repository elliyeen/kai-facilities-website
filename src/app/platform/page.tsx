import Link from "next/link";
import { ArrowRight, Database, Cpu, Workflow, BarChart3, Smartphone, Map } from "lucide-react";

export default function PlatformPage() {
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
              <Link href="/platform" className="text-sm font-light text-white hover:text-white/70 transition">
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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/dart/20260223_191335.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black"></div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }}></div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-sm font-light tracking-[0.4em] text-white/40 mb-8 uppercase">KAI Platform</p>
          <h1 className="text-6xl lg:text-8xl font-light mb-8 tracking-tight leading-none">
            The Operating System<br />
            <span className="text-white/60">for Cities and Enterprise.</span>
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/60 mb-16 max-w-3xl mx-auto leading-relaxed">
            Kai unifies data, operations, and intelligence into a single platform —
            turning complexity into clarity, at any scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-10 py-4 text-sm font-light tracking-wide hover:bg-white/90 transition"
            >
              REQUEST DEMO
            </Link>
            <Link
              href="#platform"
              className="inline-block border border-white/30 px-10 py-4 text-sm font-light tracking-wide hover:border-white hover:bg-white/5 transition"
            >
              EXPLORE THE PLATFORM
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/20">
          <span className="text-xs font-light tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-linear-to-b from-white/20 to-transparent"></div>
        </div>
      </section>

      {/* The Kai Fabric — Three Layers */}
      <section className="py-32 bg-white text-black" id="platform">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">The Kai Fabric</p>
              <h2 className="text-5xl lg:text-6xl font-light leading-tight">
                Three layers.<br />One unified truth.
              </h2>
            </div>
            <div className="lg:pt-16">
              <p className="text-xl font-light text-gray-600 leading-relaxed">
                Most organizations manage data, operations, and intelligence in silos.
                Kai dissolves those silos — connecting every data source, every person,
                and every decision into a single, living operating picture.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-1">
            <div className="bg-black text-white p-12">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8">
                <Database className="w-5 h-5 text-white/60" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/30 mb-4 uppercase">Layer 01</div>
              <h3 className="text-2xl font-light mb-6">Data Fabric</h3>
              <p className="font-light text-white/50 leading-relaxed text-sm">
                Every sensor, system, and record unified into one operational truth.
                IoT streams, workforce data, inspection logs, environmental feeds —
                all harmonized, all real-time, all in one place.
              </p>
              <div className="mt-10 pt-8 border-t border-white/10 space-y-3">
                {["IoT & sensor integration", "Legacy system connectors", "Real-time data pipelines", "Open API architecture"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-light text-white/40">
                    <div className="w-1 h-1 bg-white/30 rounded-full shrink-0"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FF6B35] text-white p-12">
              <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-8">
                <Workflow className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/50 mb-4 uppercase">Layer 02</div>
              <h3 className="text-2xl font-light mb-6">Operations Layer</h3>
              <p className="font-light text-white/70 leading-relaxed text-sm">
                Real-time orchestration of people, assets, and workflows.
                Task routing, staff deployment, incident response — all automated,
                all traceable, all accountable.
              </p>
              <div className="mt-10 pt-8 border-t border-white/20 space-y-3">
                {["Automated task routing", "GPS staff tracking", "Incident management", "Workflow automation"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-light text-white/60">
                    <div className="w-1 h-1 bg-white/50 rounded-full shrink-0"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2C3E50] text-white p-12">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-8">
                <Cpu className="w-5 h-5 text-white/60" />
              </div>
              <div className="text-xs font-light tracking-[0.3em] text-white/30 mb-4 uppercase">Layer 03</div>
              <h3 className="text-2xl font-light mb-6">Intelligence Engine</h3>
              <p className="font-light text-white/50 leading-relaxed text-sm">
                AI that predicts demand, routes resources, and learns from every
                outcome. Not a tool on top of your operations — the brain running
                through them.
              </p>
              <div className="mt-10 pt-8 border-t border-white/10 space-y-3">
                {["Predictive demand modeling", "Anomaly detection", "Adaptive ML models", "Decision intelligence"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-light text-white/40">
                    <div className="w-1 h-1 bg-white/30 rounded-full shrink-0"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20 border-b border-white/10 pb-20">
            <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">Capabilities</p>
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <h2 className="text-5xl lg:text-6xl font-light">Six modules.<br />One platform.</h2>
              <p className="text-lg font-light text-white/50 leading-relaxed">
                From predictive AI to field execution — each module is purpose-built
                and works as a standalone or as part of the complete Kai stack.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            {[
              {
                num: "01",
                icon: <Cpu className="w-5 h-5" />,
                title: "Predictive AI Engine",
                desc: "Machine learning models forecast cleaning demand, maintenance needs, and staffing requirements up to 4 hours before occurrence. Every prediction improves with each operational cycle.",
                stat: "4 hours",
                statLabel: "FORECAST HORIZON",
              },
              {
                num: "02",
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Real-Time Command Center",
                desc: "Live operational dashboard with full visibility across every asset, station, and team member. GPS tracking, IoT sensor feeds, and instant incident alerting in one unified view.",
                stat: "<30s",
                statLabel: "ALERT-TO-ACTION",
              },
              {
                num: "03",
                icon: <Map className="w-5 h-5" />,
                title: "Digital Twin",
                desc: "A complete digital replica of every facility under management. 247 inspection checkpoints per station generate compliance-ready audit reports in under 2 minutes.",
                stat: "18,031",
                statLabel: "MAPPED CHECKPOINTS",
              },
              {
                num: "04",
                icon: <Smartphone className="w-5 h-5" />,
                title: "Mobile Field App",
                desc: "Purpose-built for field crews. Receive tasks, complete inspections, log incidents, and scan assets via QR code — fully offline-capable, zero learning curve.",
                stat: "Offline-ready",
                statLabel: "CONNECTIVITY",
              },
              {
                num: "05",
                icon: <Workflow className="w-5 h-5" />,
                title: "Automated Workflows",
                desc: "AI-driven task routing eliminates manual dispatching. Right person, right task, right time — with surge-event protocols that deploy entire teams in under 5 minutes.",
                stat: "<5 min",
                statLabel: "TEAM DEPLOYMENT",
              },
              {
                num: "06",
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Analytics & Reporting",
                desc: "Executive KPI dashboards and operational reports give leadership full accountability and real-time visibility — from a single station to an entire city network.",
                stat: "24/7",
                statLabel: "VISIBILITY",
              },
            ].map((module) => (
              <div key={module.num} className="group">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl font-light text-white/20">{module.num}</div>
                  <div className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/30 group-hover:border-[#FF6B35] group-hover:text-[#FF6B35] transition">
                    {module.icon}
                  </div>
                </div>
                <h3 className="text-xl font-light mb-4">{module.title}</h3>
                <p className="font-light text-white/50 leading-relaxed text-sm">{module.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs font-light text-white/30 tracking-widest">{module.statLabel}</div>
                  <div className="text-3xl font-light mt-2">{module.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 mb-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">Where Kai Operates</p>
              <h2 className="text-5xl lg:text-6xl font-light leading-tight">Built for the world's most complex environments.</h2>
            </div>
            <div className="flex items-end">
              <p className="text-lg font-light text-gray-500 leading-relaxed">
                Kai is deployed where operational failure is not an option — high-traffic, high-stakes,
                high-complexity environments where real-time intelligence changes outcomes.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200">
            {[
              { num: "01", industry: "Transit & Cities",      desc: "Rail networks, bus systems, and urban transit — unified operational management across every station, vehicle, and crew.", proof: "73 DART stations live" },
              { num: "02", industry: "Stadiums & Events",     desc: "From daily operations to 100,000-person surge events. FIFA 2026 World Cup deployment across 9 Dallas match days.", proof: "FIFA 2026 ready" },
              { num: "03", industry: "Enterprise Facilities", desc: "Large-scale facility portfolios — corporate campuses, convention centers, mixed-use real estate — all in one operating picture.", proof: "Enterprise-grade" },
              { num: "04", industry: "Healthcare",            desc: "Hospital environments where compliance, cleanliness, and response time are mission-critical. Continuous inspection and accountability.", proof: "HIPAA-compatible" },
              { num: "05", industry: "Energy & Utilities",    desc: "Maintenance scheduling, asset inspection, and predictive failure detection for critical infrastructure.", proof: "Critical infrastructure" },
            ].map((item) => (
              <div key={item.industry} className="grid lg:grid-cols-12 gap-8 border-b border-gray-200 py-10">
                <div className="lg:col-span-1 text-2xl font-light text-gray-200">{item.num}</div>
                <div className="lg:col-span-3">
                  <h3 className="text-xl font-light">{item.industry}</h3>
                </div>
                <div className="lg:col-span-6">
                  <p className="text-lg font-light text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="lg:col-span-2 text-right">
                  <span className="text-xs font-light text-gray-400 tracking-widest">{item.proof.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Kai Works */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">The Feedback Loop</p>
              <h2 className="text-5xl font-light mb-8">From raw data to<br />field action in <br />&lt;30 seconds.</h2>
              <p className="text-lg font-light text-white/50 leading-relaxed mb-12">
                A closed-loop system that doesn't just react — it anticipates.
                Every action feeds back into the model, making Kai sharper with
                every event, every inspection, every deployment.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-light border-b border-white pb-1 hover:border-white/40 transition gap-2"
              >
                SEE A LIVE DEMO
                <ArrowRight className="w-4 h-4" />
              </Link>
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
              ].map((item) => (
                <div key={item.step} className="group">
                  <div className="grid grid-cols-[60px_1fr_auto] gap-6 items-start py-10 border-b border-white/10">
                    <div className="text-sm font-light text-white/20 pt-1">{item.step}</div>
                    <div>
                      <h3 className="text-2xl font-light mb-3">{item.title}</h3>
                      <p className="font-light text-white/40 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                    <div className="text-right pt-1">
                      <span className="text-xs font-light text-white/20 tracking-widest whitespace-nowrap">{item.metric.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Numbers */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">Measured Outcomes</p>
            <h2 className="text-5xl font-light">Numbers that matter.</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            {[
              { value: "94.2%", label: "AI PREDICTION ACCURACY" },
              { value: "60%",   label: "REDUCTION IN DOWNTIME" },
              { value: "<30s",  label: "ALERT-TO-ACTION" },
              { value: "30",    label: "DAYS TO GO-LIVE" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-6xl lg:text-7xl font-light mb-3">{s.value}</div>
                <div className="text-xs font-light text-gray-400 tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-16 grid lg:grid-cols-2 gap-x-20">
            {[
              { label: "STATIONS UNDER MANAGEMENT",   value: "73" },
              { label: "TOTAL INSPECTION POINTS",     value: "18,031" },
              { label: "INSPECTION POINTS / STATION", value: "247" },
              { label: "REPORT GENERATION TIME",      value: "<2 min" },
              { label: "TEAM DEPLOYMENT TIME",        value: "<5 min" },
              { label: "PLATFORM UPTIME SLA",         value: "99.9%" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-baseline border-b border-gray-100 py-5">
                <span className="text-xs font-light text-gray-400 tracking-widest">{row.label}</span>
                <span className="text-2xl font-light">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">Technical Foundation</p>
              <h2 className="text-5xl font-light mb-8">Enterprise-grade.<br />Day-one ready.</h2>
              <p className="text-xl font-light text-white/50 leading-relaxed mb-6">
                Cloud-native open architecture. Kai integrates with your existing
                OCC, GIS, HR, ERP, and security systems — no rip-and-replace,
                no years-long implementation.
              </p>
              <p className="text-lg font-light text-white/40 leading-relaxed mb-12">
                From contract to live operations in 30 days.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm font-light border-b border-white pb-1 hover:border-white/40 transition gap-2"
              >
                DISCUSS YOUR INTEGRATION
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-0">
              {[
                { label: "DEPLOYMENT",      value: "Cloud-native (Azure / AWS)" },
                { label: "UPTIME SLA",      value: "99.9% guaranteed" },
                { label: "DATA LATENCY",    value: "<500ms end-to-end" },
                { label: "API PROTOCOL",    value: "REST & WebSocket" },
                { label: "MOBILE OS",       value: "iOS 16+ / Android 13+" },
                { label: "SECURITY",        value: "SOC 2 Type II · AES-256" },
                { label: "COMPLIANCE",      value: "FTA · NIST 800-53" },
                { label: "GO-LIVE TIME",    value: "30 days" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-white/10 py-5">
                  <span className="text-xs font-light text-white/30 tracking-widest">{row.label}</span>
                  <span className="text-lg font-light">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-light tracking-[0.4em] text-white/30 mb-8 uppercase">Ready to See It</p>
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
              href="/world-cup-2026"
              className="inline-flex items-center justify-center border border-white/20 px-12 py-5 text-sm font-light tracking-wide hover:border-white/60 transition gap-2"
            >
              FIFA 2026 DEPLOYMENT
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
              <Link href="/#about" className="text-sm font-light text-white/40 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-sm font-light text-white/40 hover:text-white transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
