"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Linkedin, Trophy } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "demo",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setTimeout(() => setSubmitted(true), 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const daysUntil = Math.ceil(
    (new Date("2026-06-11").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

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
      <section className="pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p
            className="hero-animate text-[11px] font-medium tracking-[0.4em] text-white/30 mb-10 uppercase"
            style={{ animationDelay: "0ms" }}
          >
            Contact
          </p>
          <h1
            className="hero-animate text-[3.5rem] sm:text-[5rem] lg:text-[7rem] font-thin leading-[0.93] tracking-[-0.03em] mb-10"
            style={{ animationDelay: "160ms" }}
          >
            Let&apos;s talk.
          </h1>
          <p
            className="hero-animate text-xl text-white/50 max-w-xl leading-relaxed font-light"
            style={{ animationDelay: "320ms" }}
          >
            Whether you&apos;re a city, transit authority, or enterprise —
            we&apos;re ready to show you what Kai can do in your environment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-20">

            {/* Form */}
            <div>
              {!submitted ? (
                <>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-10 uppercase">Send a Message</p>
                  <form onSubmit={handleSubmit} className="space-y-10">

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="name" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-gray-300"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-gray-300"
                          placeholder="jane@city.gov"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="company" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-gray-300"
                          placeholder="City of Dallas"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-gray-300"
                          placeholder="(214) 555-0100"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                        I&apos;m interested in *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent appearance-none cursor-pointer"
                      >
                        <option value="demo">Platform demo</option>
                        <option value="pilot">FIFA 2026 pilot program</option>
                        <option value="rfp">RFP response</option>
                        <option value="consultation">Strategic consultation</option>
                        <option value="general">General inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[11px] font-medium tracking-[0.25em] text-gray-400 mb-4 uppercase">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent resize-none placeholder:text-gray-300"
                        placeholder="Tell us about your environment and timeline..."
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-black/80 transition-all duration-300"
                      >
                        Send message
                      </button>
                      <p className="text-[12px] text-gray-400 text-center mt-5">
                        By submitting you agree to our privacy policy.
                      </p>
                    </div>

                  </form>
                </>
              ) : (
                <div className="py-20 space-y-6">
                  <div className="text-5xl font-thin text-[#FF6B35] leading-none">✓</div>
                  <h3 className="text-4xl font-thin tracking-[-0.02em]">Message received.</h3>
                  <p className="text-gray-500 leading-relaxed font-light">
                    We respond within 24 hours.<br />In the meantime, explore the platform.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/platform"
                      className="inline-flex items-center justify-center text-sm font-medium border border-black px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-300 gap-2"
                    >
                      Explore Platform <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm font-light text-gray-400 hover:text-black transition-colors duration-200"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-16 lg:pt-14">

              {/* Contact info */}
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-8 uppercase">Contact</p>
                <div className="space-y-0">
                  {[
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: "Dallas, Texas", href: null },
                    { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", value: "linkedin.com/in/abbasabdullah", href: "https://www.linkedin.com/in/abbasabdullah/" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-gray-100 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300">{item.icon}</span>
                        <span className="text-[11px] font-medium text-gray-400 tracking-[0.2em] uppercase">{item.label}</span>
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-light text-gray-600 hover:text-black transition-colors duration-200 border-b border-transparent hover:border-gray-400"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-light text-gray-500">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 mb-8 uppercase">What Happens Next</p>
                <div className="space-y-0">
                  {[
                    { step: "01", title: "Initial response",   desc: "We reach out within 24 hours to understand your environment and goals." },
                    { step: "02", title: "Live platform demo", desc: "60-minute interactive walkthrough — command center, AI prediction, and surge scenario." },
                    { step: "03", title: "Custom proposal",    desc: "A tailored implementation plan built around your infrastructure and timeline." },
                    { step: "04", title: "Go live",            desc: "From contract to live operations in 30 days. No rip-and-replace required." },
                  ].map((item) => (
                    <div key={item.step} className="grid grid-cols-[48px_1fr] gap-4 border-b border-gray-100 py-6">
                      <span className="text-[11px] font-medium text-gray-300 tracking-[0.2em] pt-0.5">{item.step}</span>
                      <div>
                        <div className="text-sm font-medium mb-1.5">{item.title}</div>
                        <div className="text-sm font-light text-gray-400 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIFA 2026 note */}
              <div className="bg-black text-white p-10">
                <Trophy className="w-4 h-4 text-white/40 mb-8" />
                <div className="text-[10px] font-medium tracking-[0.35em] text-white/30 mb-4 uppercase">FIFA World Cup 2026</div>
                <div className="text-[3rem] font-thin leading-none tracking-[-0.02em] mb-4">{daysUntil} days.</div>
                <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">
                  The window to prepare DART for a 286% ridership surge is closing.
                  June 11 – July 19, 2026. 9 matches. AT&T Stadium, Arlington.
                </p>
                <Link
                  href="/world-cup-2026"
                  className="inline-flex items-center text-sm font-medium border-b border-white pb-1 hover:border-white/40 transition-colors duration-200 gap-2"
                >
                  View FIFA 2026 roadmap
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>
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
