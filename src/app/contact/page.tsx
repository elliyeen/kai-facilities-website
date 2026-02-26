"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Trophy } from "lucide-react";

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
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-light tracking-[0.4em] text-white/30 mb-8 uppercase">Contact</p>
          <h1 className="text-6xl lg:text-8xl font-light leading-none mb-8">
            Let's talk.
          </h1>
          <p className="text-xl font-light text-white/50 max-w-xl leading-relaxed">
            Whether you're a city, transit authority, or enterprise —
            we're ready to show you what Kai can do in your environment.
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
                  <p className="text-sm font-light tracking-[0.3em] text-gray-400 mb-10 uppercase">Send a Message</p>
                  <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="name" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent placeholder:text-gray-300"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent placeholder:text-gray-300"
                          placeholder="jane@city.gov"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="company" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent placeholder:text-gray-300"
                          placeholder="City of Dallas"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent placeholder:text-gray-300"
                          placeholder="(214) 555-0100"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                        I'm Interested In *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent appearance-none cursor-pointer"
                      >
                        <option value="demo">Platform Demo</option>
                        <option value="pilot">FIFA 2026 Pilot Program</option>
                        <option value="rfp">RFP Response</option>
                        <option value="consultation">Strategic Consultation</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-light tracking-widest text-gray-400 mb-3 uppercase">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 py-3 text-lg font-light focus:border-black outline-none transition bg-transparent resize-none placeholder:text-gray-300"
                        placeholder="Tell us about your environment and timeline..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-5 text-sm font-light tracking-wide hover:bg-black/80 transition"
                    >
                      SEND MESSAGE
                    </button>

                    <p className="text-xs font-light text-gray-400 text-center">
                      By submitting you agree to our privacy policy.
                    </p>
                  </form>
                </>
              ) : (
                <div className="border border-gray-200 p-16 text-center">
                  <div className="w-12 h-12 border border-[#27AE60] flex items-center justify-center mx-auto mb-8">
                    <div className="w-2 h-2 bg-[#27AE60] rounded-full"></div>
                  </div>
                  <h3 className="text-3xl font-light mb-4">Message received.</h3>
                  <p className="font-light text-gray-500 mb-8">
                    We'll be in touch within 24 hours to schedule your demo.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-light border-b border-black pb-1 hover:border-gray-400 transition"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-16 lg:pt-16">

              {/* Contact info */}
              <div>
                <p className="text-xs font-light tracking-widest text-gray-400 mb-8 uppercase">Contact</p>
                <div className="space-y-0">
                  {[
                    { icon: <Mail className="w-4 h-4" />, label: "EMAIL", value: "contact@kai-ai.com", href: "mailto:contact@kai-ai.com" },
                    { icon: <Phone className="w-4 h-4" />, label: "PHONE", value: "(214) 555-0100", href: "tel:+12145550100" },
                    { icon: <MapPin className="w-4 h-4" />, label: "LOCATION", value: "Dallas-Fort Worth, Texas", href: null },
                    { icon: <Linkedin className="w-4 h-4" />, label: "LINKEDIN", value: "linkedin.com/company/kai-ai", href: "https://linkedin.com/company/kai-ai" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-baseline justify-between border-b border-gray-100 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300">{item.icon}</span>
                        <span className="text-xs font-light tracking-widest text-gray-400">{item.label}</span>
                      </div>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-light hover:text-gray-500 transition border-b border-transparent hover:border-gray-400">
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
                <p className="text-xs font-light tracking-widest text-gray-400 mb-8 uppercase">What Happens Next</p>
                <div className="space-y-0">
                  {[
                    { step: "01", title: "Initial Response",   desc: "We reach out within 24 hours to understand your environment and goals." },
                    { step: "02", title: "Live Platform Demo", desc: "60-minute interactive walkthrough — command center, AI prediction, and surge scenario." },
                    { step: "03", title: "Custom Proposal",    desc: "A tailored implementation plan built around your infrastructure and timeline." },
                    { step: "04", title: "Go Live",            desc: "From contract to live operations in 30 days. No rip-and-replace required." },
                  ].map((item) => (
                    <div key={item.step} className="grid grid-cols-[40px_1fr] gap-4 border-b border-gray-100 py-5">
                      <span className="text-sm font-light text-gray-300">{item.step}</span>
                      <div>
                        <div className="text-sm font-light mb-1">{item.title}</div>
                        <div className="text-sm font-light text-gray-400 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIFA 2026 note */}
              <div className="bg-black text-white p-8">
                <Trophy className="w-5 h-5 text-white/60 mb-6" />
                <div className="text-xs font-light tracking-widest text-white/30 mb-3 uppercase">FIFA World Cup 2026</div>
                <div className="text-3xl font-light mb-4">{daysUntil} days.</div>
                <p className="text-sm font-light text-white/50 leading-relaxed mb-8">
                  The window to prepare DART for a 286% ridership surge is closing.
                  June 11 – July 19, 2026. 9 matches. AT&T Stadium, Arlington.
                </p>
                <Link
                  href="/world-cup-2026"
                  className="inline-flex items-center text-sm font-light border-b border-white pb-1 hover:border-white/40 transition gap-2"
                >
                  VIEW FIFA 2026 ROADMAP
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
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
