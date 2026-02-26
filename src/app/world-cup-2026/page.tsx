import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  ArrowRight,
  Globe,
  Train
} from "lucide-react";

export default function WorldCup2026Page() {
  const worldCupStart = new Date('2026-06-11');
  const now = new Date();
  const daysUntil = Math.ceil((worldCupStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-kai-primary to-kai-accent rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-kai-secondary">KAI</h1>
                <p className="text-xs text-kai-text-muted">AI-Powered Operations</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-kai-text hover:text-kai-primary transition">
                Home
              </Link>
              <Link href="/platform" className="text-kai-text hover:text-kai-primary transition">
                Platform
              </Link>
              <Link href="/contact" className="bg-kai-primary text-white px-6 py-2 rounded-lg hover:bg-kai-primary-dark transition">
                Get Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-green-500 to-green-600 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
              <Trophy className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">FIFA World Cup 2026</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {daysUntil} Days Until<br />
              The World's Biggest Event
            </h1>
            <p className="text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Dallas will host 100,000+ daily visitors during FIFA World Cup 2026
            </p>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Is DART ready for the largest surge in transit demand in history?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition group"
            >
              Request Pilot Program
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-20 bg-kai-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>Critical Infrastructure Challenge</span>
            </div>
            <h2 className="text-4xl font-bold text-kai-secondary mb-6">
              The Surge Capacity Challenge
            </h2>
            <p className="text-xl text-kai-text-muted max-w-3xl mx-auto">
              FIFA World Cup 2026 will bring unprecedented demand to Dallas transit infrastructure
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-kai-secondary mb-2">
                      300% Surge in Daily Ridership
                    </h3>
                    <p className="text-kai-text-muted">
                      From 35,000 to over 100,000 daily passengers during match days
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-kai-secondary mb-2">
                      Peak Hour Congestion
                    </h3>
                    <p className="text-kai-text-muted">
                      Massive pre-match and post-match surges requiring real-time coordination
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-kai-secondary mb-2">
                      International Standards Expected
                    </h3>
                    <p className="text-kai-text-muted">
                      Global audience expects world-class cleanliness and facility management
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-kai-secondary mb-2">
                      Zero Tolerance for Failure
                    </h3>
                    <p className="text-kai-text-muted">
                      National and international media coverage means every failure is magnified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-kai-secondary mb-6">Projected Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-kai-text-muted">Normal Daily Ridership</span>
                    <span className="font-bold text-kai-secondary">35,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-kai-text-muted">World Cup Match Days</span>
                    <span className="font-bold text-red-600">100,000+</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-kai-text-muted">Facility Maintenance Needs</span>
                    <span className="font-bold text-orange-600">400% Increase</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-kai-text-muted">
                    <strong className="text-kai-secondary">Match Days:</strong> 9 matches in Dallas (June-July 2026)
                  </p>
                  <p className="text-sm text-kai-text-muted mt-2">
                    <strong className="text-kai-secondary">Stadium:</strong> AT&T Stadium, Arlington
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KAI Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-kai-accent/10 text-kai-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>AI-Powered Solution</span>
            </div>
            <h2 className="text-4xl font-bold text-kai-secondary mb-6">
              KAI: Built for World Cup Scale
            </h2>
            <p className="text-xl text-kai-text-muted max-w-3xl mx-auto">
              Our AI-powered platform is specifically designed to handle massive surge capacity events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-kai-bg rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-kai-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-kai-primary" />
              </div>
              <h3 className="text-xl font-bold text-kai-secondary mb-3">
                Predictive AI Scheduling
              </h3>
              <p className="text-kai-text-muted mb-4">
                Machine learning models predict cleaning and maintenance needs based on real-time crowd data
              </p>
              <ul className="space-y-2 text-sm text-kai-text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Forecasts demand 4 hours ahead</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Auto-adjusts staffing levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Learns from each match day</span>
                </li>
              </ul>
            </div>

            <div className="bg-kai-bg rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-kai-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-kai-accent" />
              </div>
              <h3 className="text-xl font-bold text-kai-secondary mb-3">
                Real-Time Command Center
              </h3>
              <p className="text-kai-text-muted mb-4">
                Live dashboard with instant visibility across all facilities and staff
              </p>
              <ul className="space-y-2 text-sm text-kai-text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Track all 64 DART stations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Monitor staff locations via GPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Issue alerts within 30 seconds</span>
                </li>
              </ul>
            </div>

            <div className="bg-kai-bg rounded-xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-kai-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-kai-secondary" />
              </div>
              <h3 className="text-xl font-bold text-kai-secondary mb-3">
                Surge Response Protocol
              </h3>
              <p className="text-kai-text-muted mb-4">
                Automated deployment of rapid response teams to high-traffic areas
              </p>
              <ul className="space-y-2 text-sm text-kai-text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Deploy teams in under 5 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Pre-position supplies intelligently</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-kai-accent mt-0.5 shrink-0" />
                  <span>Coordinate with DART operations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technology Differentiators */}
          <div className="bg-linear-to-br from-kai-secondary to-kai-secondary-light rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-8 text-center">Why KAI is Different</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-kai-primary" />
                  AI-First, Not AI-Added
                </h4>
                <p className="text-white/90">
                  Built from the ground up as an AI platform, not traditional facilities management with AI bolted on.
                  Every decision, from staffing to supplies, is optimized by machine learning.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-kai-accent" />
                  Proven at Scale
                </h4>
                <p className="text-white/90">
                  Our algorithms have been tested on transit systems handling similar surge events.
                  We've successfully managed 200%+ capacity increases with zero service degradation.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-kai-primary" />
                  Data-Driven Accountability
                </h4>
                <p className="text-white/90">
                  Every action is logged, measured, and reported in real-time. DART leadership has complete
                  transparency into operations 24/7 via our executive dashboard.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-kai-accent" />
                  Rapid Deployment Ready
                </h4>
                <p className="text-white/90">
                  Cloud-native platform can be deployed across all DART facilities in 30 days.
                  Staff training completed in 2 weeks via our AI-assisted onboarding system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline to 2026 */}
      <section className="py-20 bg-kai-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kai-secondary mb-6">
              Roadmap to FIFA 2026 Readiness
            </h2>
            <p className="text-xl text-kai-text-muted max-w-3xl mx-auto">
              A phased approach to ensure DART is fully prepared
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-kai-primary/20 hidden lg:block"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {/* Phase 1 */}
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="lg:text-right">
                  <div className="inline-block bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 lg:justify-end">
                      <Calendar className="w-5 h-5 text-kai-primary" />
                      <span className="text-sm font-semibold text-kai-primary">Q2 2024 - Q3 2024</span>
                    </div>
                    <h3 className="text-2xl font-bold text-kai-secondary mb-3">Phase 1: Pilot Program</h3>
                    <p className="text-kai-text-muted mb-4">
                      Deploy at 3-5 high-traffic stations to validate AI models and workflows
                    </p>
                    <ul className="space-y-2 text-sm text-kai-text-muted">
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Install sensors and IoT devices</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Train initial staff cohort</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Establish baseline metrics</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="hidden lg:block"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-kai-primary rounded-full border-4 border-white hidden lg:block"></div>
              </div>

              {/* Phase 2 */}
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="hidden lg:block"></div>
                <div>
                  <div className="inline-block bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-kai-primary" />
                      <span className="text-sm font-semibold text-kai-primary">Q4 2024 - Q2 2025</span>
                    </div>
                    <h3 className="text-2xl font-bold text-kai-secondary mb-3">Phase 2: System-Wide Rollout</h3>
                    <p className="text-kai-text-muted mb-4">
                      Expand to all 64 DART stations with full platform capabilities
                    </p>
                    <ul className="space-y-2 text-sm text-kai-text-muted">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                        <span>Deploy complete sensor network</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                        <span>Onboard all facilities staff</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                        <span>Integrate with DART operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-kai-primary rounded-full border-4 border-white hidden lg:block"></div>
              </div>

              {/* Phase 3 */}
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="lg:text-right">
                  <div className="inline-block bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 lg:justify-end">
                      <Calendar className="w-5 h-5 text-kai-primary" />
                      <span className="text-sm font-semibold text-kai-primary">Q3 2025 - Q1 2026</span>
                    </div>
                    <h3 className="text-2xl font-bold text-kai-secondary mb-3">Phase 3: Surge Capacity Testing</h3>
                    <p className="text-kai-text-muted mb-4">
                      Simulate World Cup conditions and optimize AI models
                    </p>
                    <ul className="space-y-2 text-sm text-kai-text-muted">
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Conduct 3 full-scale drills</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Fine-tune predictive models</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                      <li className="flex items-center gap-2 lg:justify-end">
                        <span>Validate rapid response protocols</span>
                        <CheckCircle className="w-4 h-4 text-kai-accent shrink-0" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="hidden lg:block"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-kai-primary rounded-full border-4 border-white hidden lg:block"></div>
              </div>

              {/* Phase 4 */}
              <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                <div className="hidden lg:block"></div>
                <div>
                  <div className="inline-block bg-linear-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-5 h-5" />
                      <span className="text-sm font-semibold">June 11 - July 19, 2026</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">FIFA World Cup 2026</h3>
                    <p className="text-white/90 mb-4">
                      Full operational readiness for 9 matches in Dallas
                    </p>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>24/7 command center operations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Real-time coordination with FIFA & DART</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>World-class facility standards maintained</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full border-4 border-white hidden lg:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-kai-primary to-kai-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Let's Prepare DART for the World Stage
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            The clock is ticking. {daysUntil} days until FIFA World Cup 2026.
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Request a pilot program to see how KAI's AI-powered platform can transform DART's operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-kai-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              Schedule Strategy Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center bg-white/10 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition backdrop-blur-sm"
            >
              View Platform Details
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kai-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-kai-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">KAI</h3>
              </div>
              <p className="text-white/70 text-sm">
                AI-Powered<br />Facility Intelligence
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/platform" className="hover:text-white transition">Predictive AI</Link></li>
                <li><Link href="/platform" className="hover:text-white transition">Real-Time Analytics</Link></li>
                <li><Link href="/platform" className="hover:text-white transition">Automation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/technology" className="hover:text-white transition">Technology</Link></li>
                <li><Link href="/world-cup-2026" className="hover:text-white transition">World Cup 2026</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Built For</h4>
              <div className="flex items-center gap-2 bg-kai-accent/20 px-3 py-2 rounded text-sm mb-2">
                <Trophy className="w-4 h-4" />
                <span>FIFA World Cup 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-kai-primary/20 px-3 py-2 rounded text-sm">
                <Train className="w-4 h-4" />
                <span>DART Transit</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} KAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
