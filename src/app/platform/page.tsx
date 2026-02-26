import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

      {/* Hero */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581362716668-5c09b0ad307a?w=2400&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        <div className="relative z-10 text-center px-6">
          <p className="text-sm font-light tracking-[0.3em] text-white/50 mb-6 uppercase">KAI Platform</p>
          <h1 className="text-6xl lg:text-8xl font-light mb-8 tracking-tight">
            Six Modules.<br />One Platform.
          </h1>
          <p className="text-xl lg:text-2xl font-light text-white/80 mb-12 max-w-2xl mx-auto">
            End-to-end facility intelligence — from predictive maintenance
            to real-time command operations.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-white px-8 py-4 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
          >
            REQUEST DEMO
          </Link>
        </div>
      </section>

      {/* Performance Numbers */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl font-light mb-20">Performance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {[
              { value: "94.2%", label: "AI PREDICTION ACCURACY" },
              { value: "<30s",  label: "INCIDENT RESPONSE TIME" },
              { value: "60%",   label: "DOWNTIME REDUCTION" },
              { value: "73",    label: "DART STATIONS SUPPORTED" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-6xl font-light mb-2">{s.value}</div>
                <div className="text-sm font-light text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-20 space-y-6">
            {[
              { label: "DART STATIONS",               value: "73" },
              { label: "DART LIGHT RAIL VEHICLES",    value: "163" },
              { label: "INSPECTION POINTS / STATION", value: "247" },
              { label: "TOTAL INSPECTION POINTS",     value: "18,031" },
              { label: "REPORT GENERATION TIME",      value: "<2 min" },
              { label: "STAFF DEPLOYMENT TIME",       value: "<5 min" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-baseline border-b border-gray-200 pb-4">
                <span className="text-sm font-light text-gray-500">{row.label}</span>
                <span className="text-2xl font-light">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl font-light mb-20">The Platform</h2>
          <div className="grid lg:grid-cols-3 gap-16">

            <div>
              <div className="text-7xl font-light mb-4">01</div>
              <h3 className="text-2xl font-light mb-4">Predictive AI Engine</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Machine learning models forecast cleaning demand, maintenance needs,
                and staffing requirements up to 4 hours ahead of occurrence.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">FORECAST HORIZON</div>
                <div className="text-3xl font-light mt-1">4 hours</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">02</div>
              <h3 className="text-2xl font-light mb-4">Real-Time Command Center</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Live operational dashboard with full visibility across all 73 DART stations.
                GPS staff tracking, IoT sensors, and instant incident alerting.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">ALERT RESPONSE</div>
                <div className="text-3xl font-light mt-1">&lt;30s</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">03</div>
              <h3 className="text-2xl font-light mb-4">Mobile Field App</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Purpose-built app for field crews. Receive tasks, log inspections, and
                capture issues — fully offline-capable with QR asset scanning.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">CONNECTIVITY</div>
                <div className="text-3xl font-light mt-1">Offline-ready</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">04</div>
              <h3 className="text-2xl font-light mb-4">Station Inspection System</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Complete digital twin of all 73 DART stations. 247 inspection checkpoints
                per station generate compliance-ready reports in under 2 minutes.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">CHECKPOINTS / STATION</div>
                <div className="text-3xl font-light mt-1">247</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">05</div>
              <h3 className="text-2xl font-light mb-4">Automated Workflows</h3>
              <p className="font-light text-white/60 leading-relaxed">
                AI-driven task routing eliminates manual dispatching. Right person, right task,
                right time — with surge-event rapid response protocols built in.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">TEAM DEPLOYMENT</div>
                <div className="text-3xl font-light mt-1">&lt;5 min</div>
              </div>
            </div>

            <div>
              <div className="text-7xl font-light mb-4">06</div>
              <h3 className="text-2xl font-light mb-4">Analytics & Reporting</h3>
              <p className="font-light text-white/60 leading-relaxed">
                Executive KPI dashboards and operational reports give DART leadership
                full accountability and real-time visibility into facilities performance.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-light text-white/40">VISIBILITY</div>
                <div className="text-3xl font-light mt-1">24/7</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl font-light mb-8">How It Works</h2>
              <p className="text-xl font-light text-gray-600 leading-relaxed">
                From raw sensor data to field action in under 30 seconds.
                A closed-loop system that gets smarter with every event.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { step: "01", title: "Data Ingestion",   desc: "IoT sensors, turnstile counts, and DART operations data stream into the platform in real time." },
                { step: "02", title: "AI Analysis",      desc: "ML models process incoming data, detect anomalies, and forecast the next 4 hours of demand." },
                { step: "03", title: "Smart Alerting",   desc: "Automated alerts dispatched to the right supervisor based on location, role, and priority." },
                { step: "04", title: "Field Execution",  desc: "Crews complete tasks via mobile app, closing the feedback loop and improving future predictions." },
              ].map((item) => (
                <div key={item.step}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-light text-gray-500">{item.step} — {item.title.toUpperCase()}</span>
                  </div>
                  <p className="text-lg font-light text-gray-600">{item.desc}</p>
                  <div className="h-px bg-gray-200 mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl font-light mb-8">Architecture</h2>
              <p className="text-xl font-light text-white/60 leading-relaxed">
                Cloud-native, open API architecture. Integrates with DART's
                existing OCC, GIS, HR, and security systems within 30 days.
                No rip-and-replace required.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center mt-12 text-sm font-light border-b border-white pb-1 hover:border-white/40 transition"
              >
                DISCUSS INTEGRATION
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-6">
              {[
                { label: "DEPLOYMENT",      value: "Cloud-native (Azure / AWS)" },
                { label: "UPTIME SLA",      value: "99.9% guaranteed" },
                { label: "DATA LATENCY",    value: "<500ms end-to-end" },
                { label: "API PROTOCOL",    value: "REST & WebSocket" },
                { label: "MOBILE OS",       value: "iOS 16+ / Android 13+" },
                { label: "SECURITY",        value: "SOC 2 Type II, AES-256" },
                { label: "COMPLIANCE",      value: "FTA, NIST 800-53" },
                { label: "GO-LIVE TIME",    value: "30 days" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-white/10 pb-4">
                  <span className="text-sm font-light text-white/40">{row.label}</span>
                  <span className="text-lg font-light">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-light mb-8">
            See KAI in Action
          </h2>
          <p className="text-xl font-light text-white/60 mb-12">
            A 60-minute live demo — station inspection, command center simulation,
            and FIFA 2026 surge scenario
          </p>
          <Link
            href="/contact"
            className="inline-block border border-white px-10 py-5 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
          >
            REQUEST LIVE DEMO
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-sm font-light text-white/40">
              © {new Date().getFullYear()} KAI. AI-Powered Facility Intelligence.
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
