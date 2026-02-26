import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DALLAS_MATCHES = [
  { stage: "Group Stage",  date: "Jun 14, 2026", time: "3:00 PM CT",  home: "Netherlands",          away: "Japan",                   group: "Group F" },
  { stage: "Group Stage",  date: "Jun 17, 2026", time: "3:00 PM CT",  home: "England",               away: "Croatia",                 group: "Group L" },
  { stage: "Group Stage",  date: "Jun 22, 2026", time: "12:00 PM CT", home: "Argentina",             away: "Austria",                 group: "Group J" },
  { stage: "Group Stage",  date: "Jun 25, 2026", time: "6:00 PM CT",  home: "Japan",                 away: "UEFA Playoff B Winner",   group: "Group F" },
  { stage: "Group Stage",  date: "Jun 27, 2026", time: "9:00 PM CT",  home: "Jordan",                away: "Argentina",               group: "Group J" },
  { stage: "Round of 32",  date: "Jun 30, 2026", time: "12:00 PM CT", home: "Group E Runner-up",     away: "Group I Runner-up",       group: "Knockout" },
  { stage: "Round of 32",  date: "Jul 3, 2026",  time: "1:00 PM CT",  home: "Group D Runner-up",     away: "Group G Runner-up",       group: "Knockout" },
  { stage: "Round of 16",  date: "Jul 6, 2026",  time: "2:00 PM CT",  home: "TBD",                   away: "TBD",                     group: "Knockout" },
  { stage: "Semi-Final",   date: "Jul 14, 2026", time: "2:00 PM CT",  home: "TBD",                   away: "TBD",                     group: "Semi-Final" },
];

export default function WorldCup2026Page() {
  const daysUntil = Math.ceil(
    (new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

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
              <Link href="/world-cup-2026" className="text-sm font-light text-white hover:text-white/70 transition">
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
      <section className="min-h-screen flex items-end pb-32 pt-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-sm font-light tracking-[0.4em] text-white/40 mb-6 uppercase">FIFA World Cup 2026</p>
              <div className="text-[140px] lg:text-[200px] font-light leading-none">{daysUntil}</div>
              <p className="text-2xl font-light text-white/60 mt-4">days until the world arrives in Dallas.</p>
            </div>
            <div className="lg:pb-4">
              <p className="text-xl font-light text-white/50 leading-relaxed mb-10">
                Nine matches. AT&T Stadium. 100,000+ daily visitors.
                DART must handle a 286% surge in ridership with zero tolerance for failure.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-white px-8 py-4 text-sm font-light tracking-wide hover:bg-white hover:text-black transition"
              >
                REQUEST PILOT PROGRAM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">The Challenge</p>
              <h2 className="text-5xl font-light leading-tight">
                The largest surge in transit demand Dallas has ever seen.
              </h2>
            </div>
            <div>
              {[
                { label: "NORMAL DAILY RIDERSHIP",    value: "35,000" },
                { label: "MATCH DAY DEMAND",          value: "100,000+" },
                { label: "SURGE CAPACITY REQUIRED",   value: "+286%" },
                { label: "MATCHES IN DALLAS",         value: "9" },
                { label: "MAINTENANCE NEED INCREASE", value: "400%" },
                { label: "TOLERANCE FOR FAILURE",     value: "Zero" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline border-b border-gray-200 py-5">
                  <span className="text-sm font-light text-gray-500">{row.label}</span>
                  <span className="text-2xl font-light">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Match Schedule */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">AT&T Stadium · Arlington, Texas</p>
            <h2 className="text-5xl font-light">9 matches.<br />One city. World stage.</h2>
          </div>

          <div className="border-t border-gray-200">
            {DALLAS_MATCHES.map((match, i) => (
              <div key={i} className="grid lg:grid-cols-12 gap-6 border-b border-gray-200 py-6 items-baseline">
                <div className="lg:col-span-2">
                  <div className="text-sm font-light text-gray-500">{match.date}</div>
                  <div className="text-xs font-light text-gray-400 mt-1">{match.time}</div>
                </div>
                <div className="lg:col-span-6 text-lg font-light">
                  {match.home} <span className="text-gray-300 mx-2">vs</span> {match.away}
                </div>
                <div className="lg:col-span-2 text-xs font-light text-gray-400 tracking-widest">{match.group}</div>
                <div className="lg:col-span-2 text-xs font-light text-gray-400 tracking-widest text-right">{match.stage.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <p className="text-xs font-light text-gray-400 mt-6">All times Central. Knockout opponents determined by group results.</p>
        </div>
      </section>

      {/* KAI Solution */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <p className="text-sm font-light tracking-[0.3em] text-white/30 mb-6 uppercase">KAI Solution</p>
            <h2 className="text-5xl font-light">Built for World Cup scale.</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              {
                num: "01",
                title: "Predictive AI Scheduling",
                stat: "94.2%", label: "ACCURACY",
                desc: "Machine learning forecasts maintenance needs based on real-time crowd data — 4 hours ahead, staffing auto-adjusted before demand hits.",
              },
              {
                num: "02",
                title: "Real-Time Command Center",
                stat: "<30s", label: "ALERT TO ACTION",
                desc: "Live visibility across all 65 DART stations. Staff GPS, IoT sensor feeds, and incident alerts surfaced in under 30 seconds.",
              },
              {
                num: "03",
                title: "Surge Response Protocol",
                stat: "<5min", label: "TEAM DEPLOYMENT",
                desc: "Automated dispatch of rapid response teams. Supplies pre-positioned, coordinated with DART operations — before crowds arrive.",
              },
            ].map((item) => (
              <div key={item.num}>
                <div className="text-7xl font-light text-white/20 mb-4">{item.num}</div>
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="font-light text-white/60 leading-relaxed">{item.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-xs font-light text-white/30 tracking-widest">{item.label}</div>
                  <div className="text-3xl font-light mt-2">{item.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 mb-20">
            <div>
              <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-6 uppercase">Roadmap</p>
              <h2 className="text-5xl font-light leading-tight">Four phases.<br />One goal.</h2>
            </div>
            <div className="flex items-end">
              <p className="text-xl font-light text-gray-500 leading-relaxed">
                A phased deployment ensures DART is fully operational long before the first match kicks off.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200">
            {[
              { phase: "01", title: "Pilot Program",          period: "Q2 2025",       desc: "3–5 high-traffic stations. AI models validated, baseline metrics established, initial staff trained." },
              { phase: "02", title: "System-Wide Rollout",    period: "Q3–Q4 2025",    desc: "All 65 DART stations live. Full sensor network deployed, complete staff onboarding, DART operations integrated." },
              { phase: "03", title: "Surge Capacity Testing", period: "Q1 2026",        desc: "Full-scale simulations of World Cup conditions. AI models fine-tuned, rapid response protocols validated." },
              { phase: "04", title: "FIFA World Cup 2026",    period: "Jun – Jul 2026", desc: "24/7 command center operations across 9 match days. Real-time coordination. World-class facility standards maintained." },
            ].map((item) => (
              <div key={item.phase} className="grid lg:grid-cols-12 gap-8 border-b border-gray-200 py-10">
                <div className="lg:col-span-1 text-3xl font-light text-gray-200">{item.phase}</div>
                <div className="lg:col-span-3">
                  <h3 className="text-xl font-light mb-1">{item.title}</h3>
                  <p className="text-sm font-light text-gray-400">{item.period}</p>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-lg font-light text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-light mb-8">
            {daysUntil} days to get ready.
          </h2>
          <p className="text-xl font-light text-white/60 mb-12 max-w-2xl mx-auto">
            Start with a pilot program across 3–5 stations. See results in 30 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-12 py-5 text-sm font-light tracking-wide hover:bg-white/90 transition"
            >
              REQUEST PILOT PROGRAM
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center justify-center border border-white/20 px-12 py-5 text-sm font-light tracking-wide hover:border-white/60 transition gap-2"
            >
              VIEW PLATFORM
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
              © {new Date().getFullYear()} KAI. AI-Powered Facility Intelligence.
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
