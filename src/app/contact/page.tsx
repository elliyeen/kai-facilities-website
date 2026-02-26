"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Brain,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Trophy,
  Clock,
  Calendar,
  Linkedin,
  ArrowRight
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "demo",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement actual form submission to backend/email service
    console.log("Form submitted:", formData);

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              <Link href="/world-cup-2026" className="text-kai-text hover:text-kai-primary transition">
                World Cup 2026
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-linear-to-br from-kai-secondary via-kai-secondary-light to-kai-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Let's Transform DART Together
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            See how KAI's AI-powered platform can prepare Dallas transit for FIFA World Cup 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-kai-secondary mb-4">
                  Get Started Today
                </h2>
                <p className="text-kai-text-muted">
                  Fill out the form and we'll get back to you within 24 hours to schedule a demo
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-kai-secondary mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-kai-secondary mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition"
                        placeholder="john@dart.org"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-kai-secondary mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition"
                        placeholder="Dallas Area Rapid Transit"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-kai-secondary mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition"
                        placeholder="(214) 555-0100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold text-kai-secondary mb-2">
                      I'm interested in *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="demo">Platform Demo</option>
                      <option value="pilot">FIFA 2026 Pilot Program</option>
                      <option value="rfp">RFP Response</option>
                      <option value="consultation">Strategic Consultation</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-kai-secondary mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent outline-none transition resize-none"
                      placeholder="Tell us about your needs and timeline..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-kai-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-kai-primary-dark transition flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>

                  <p className="text-sm text-kai-text-muted text-center">
                    By submitting this form, you agree to our privacy policy
                  </p>
                </form>
              ) : (
                <div className="bg-kai-accent/10 border-2 border-kai-accent rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-kai-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-kai-secondary mb-3">
                    Thank You!
                  </h3>
                  <p className="text-kai-text-muted mb-6">
                    We've received your message and will get back to you within 24 hours to schedule your demo.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-kai-primary font-semibold hover:text-kai-primary-dark transition"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information & Details */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-kai-bg rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-kai-secondary mb-6">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-kai-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-kai-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Email</p>
                      <a href="mailto:contact@kai-ai.com" className="text-kai-primary hover:text-kai-primary-dark transition">
                        contact@kai-ai.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-kai-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-kai-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Phone</p>
                      <a href="tel:+12145550100" className="text-kai-primary hover:text-kai-primary-dark transition">
                        (214) 555-0100
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-kai-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-kai-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Location</p>
                      <p className="text-kai-text-muted">
                        Dallas-Fort Worth Metroplex<br />
                        Texas, United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-kai-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Linkedin className="w-5 h-5 text-kai-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">LinkedIn</p>
                      <a href="https://linkedin.com/company/kai-ai" target="_blank" rel="noopener noreferrer" className="text-kai-primary hover:text-kai-primary-dark transition">
                        linkedin.com/company/kai-ai
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIFA 2026 Urgency */}
              <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-8 text-white">
                <Trophy className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  FIFA World Cup 2026 Timeline
                </h3>
                <p className="text-white/90 mb-6">
                  The clock is ticking. DART needs to be ready for the world's biggest event.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Pilot Program Start</p>
                      <p className="text-sm text-white/80">Q2 2024 (Immediate)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold">System-Wide Deployment</p>
                      <p className="text-sm text-white/80">12-18 months timeline</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold">FIFA World Cup 2026</p>
                      <p className="text-sm text-white/80">June 11 - July 19, 2026</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/world-cup-2026"
                  className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold mt-6 hover:bg-gray-100 transition group"
                >
                  View FIFA 2026 Roadmap
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
              </div>

              {/* What Happens Next */}
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-kai-secondary mb-4">
                  What Happens Next?
                </h3>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-kai-primary text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Initial Response</p>
                      <p className="text-sm text-kai-text-muted">We'll reach out within 24 hours to understand your needs</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-kai-primary text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Live Platform Demo</p>
                      <p className="text-sm text-kai-text-muted">60-minute interactive demo of KAI's AI capabilities</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-kai-primary text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Custom Proposal</p>
                      <p className="text-sm text-kai-text-muted">Tailored implementation plan for DART's specific needs</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-kai-accent text-white rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-kai-secondary">Pilot Program Launch</p>
                      <p className="text-sm text-kai-text-muted">Start with 3-5 high-traffic stations within 30 days</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
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
