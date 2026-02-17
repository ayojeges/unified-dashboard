"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  Cloud, 
  Users,
  Linkedin,
  Twitter,
  Github,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  Snowflake,
  Brain,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const [activeCapability, setActiveCapability] = useState(0);

  const brands = [
    {
      name: "GuardianCryo",
      focus: "Health Tech",
      description: "Advanced cooling recovery solutions powered by precision IT.",
      icon: Snowflake,
      color: "#00D4FF",
      link: "/projects/guardiancryo"
    },
    {
      name: "ApplyIntelligent",
      focus: "AI Integration",
      description: "Streamlining complex applications through smart automation.",
      icon: Brain,
      color: "#8B5CF6",
      link: "/projects/apply-intelligent"
    },
    {
      name: "CDLSchoolsUSA",
      focus: "Ed-Tech / Logistics",
      description: "Digitizing the road to professional driving careers.",
      icon: GraduationCap,
      color: "#10B981",
      link: "/projects/cdl-schools"
    }
  ];

  const capabilities = [
    {
      icon: Code2,
      title: "Custom Software Development",
      description: "Tailored solutions that solve specific bottlenecks and drive efficiency across your operations."
    },
    {
      icon: Cloud,
      title: "Cloud Architecture",
      description: "Secure, scalable infrastructure designed for modern enterprises with 99.9% uptime guarantee."
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Every line of code is written with the end-user's 'ease of life' in mind."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A192F] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#64FFDA] to-[#00D4FF] flex items-center justify-center">
                <Code2 className="h-5 w-5 text-[#0A192F]" />
              </div>
              <span className="font-bold text-lg">Blueprint Creations LLC</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#portfolio" className="text-sm text-gray-400 hover:text-[#64FFDA] transition-colors">Portfolio</a>
              <a href="#capabilities" className="text-sm text-gray-400 hover:text-[#64FFDA] transition-colors">Services</a>
              <a href="#contact" className="text-sm text-gray-400 hover:text-[#64FFDA] transition-colors">Contact</a>
              <Link href="/auth/login" className="text-sm bg-[#64FFDA]/10 text-[#64FFDA] px-4 py-2 rounded-lg hover:bg-[#64FFDA]/20 transition-colors border border-[#64FFDA]/30">
                Staff Login
              </Link>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-400 hover:text-white">
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#64FFDA]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl"></div>
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#64FFDA]/10 border border-[#64FFDA]/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#64FFDA] animate-pulse"></span>
            <span className="text-sm text-[#64FFDA]">Now Accepting New Projects</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Engineering the Future
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64FFDA] to-[#00D4FF]">
              of Daily Life
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Blueprint Creations LLC is a premier IT solutions firm dedicated to deploying intelligent ecosystems. 
            We don't just build software; we architect ease.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#portfolio" 
              className="group flex items-center gap-2 bg-[#64FFDA] text-[#0A192F] px-8 py-4 rounded-lg font-semibold hover:bg-[#64FFDA]/90 transition-all"
            >
              Explore Our Brands
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact" 
              className="flex items-center gap-2 border border-[#64FFDA]/30 text-[#64FFDA] px-8 py-4 rounded-lg font-semibold hover:bg-[#64FFDA]/10 transition-all"
            >
              Get in Touch
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-[#64FFDA]/50" />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Portfolio</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A diverse ecosystem of solutions driving innovation across industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {brands.map((brand, index) => (
              <Link 
                key={brand.name}
                href={brand.link}
                className="group relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-[#64FFDA]/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${brand.color}20` }}
                >
                  <brand.icon className="h-7 w-7" style={{ color: brand.color }} />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#64FFDA] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm font-medium mb-4" style={{ color: brand.color }}>
                  {brand.focus}
                </p>
                <p className="text-gray-400">
                  {brand.description}
                </p>

                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-[#64FFDA]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 bg-gradient-to-b from-[#0A192F] to-[#0D1F3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              End-to-end solutions engineered for excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <div 
                key={cap.title}
                className={`relative p-8 rounded-2xl transition-all cursor-pointer ${
                  activeCapability === index 
                    ? 'bg-gradient-to-br from-[#64FFDA]/20 to-transparent border-[#64FFDA]/30' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                } border`}
                onClick={() => setActiveCapability(index)}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                  activeCapability === index ? 'bg-[#64FFDA]' : 'bg-white/10'
                }`}>
                  <cap.icon className={`h-6 w-6 ${
                    activeCapability === index ? 'text-[#0A192F]' : 'text-[#64FFDA]'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                <p className="text-gray-400">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#0D1F3C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-[#64FFDA]/20 text-8xl font-serif">"</div>
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed text-center relative z-10">
              Our mission is simple: we identify friction in the real world and erase it through digital excellence. 
              Whether it's logistics, health, or AI, our blueprint remains the same—
              <span className="text-[#64FFDA] font-medium">innovation that serves humanity.</span>
            </blockquote>
            <div className="absolute -bottom-8 -right-4 text-[#64FFDA]/20 text-8xl font-serif rotate-180">"</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Let's Build Together</h2>
              <p className="text-gray-400 mb-8">
                Ready to transform your business with cutting-edge technology? 
                Reach out to our team and let's discuss your next project.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#64FFDA]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#64FFDA]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Texas Headquarters</h3>
                    <p className="text-gray-400">1827 Richmond PKWY, STE 102<br />Richmond, TX 77469</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#64FFDA]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#64FFDA]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">General Inquiries</h3>
                    <a href="mailto:hello@blueprintcreations.com" className="text-[#64FFDA] hover:underline">
                      hello@blueprintcreations.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#64FFDA]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#64FFDA]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <a href="tel:+18325135336" className="text-[#64FFDA] hover:underline">
                      +1 (832) 513-5336
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA]/50"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA]/50"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA]/50"
                />
                <input 
                  type="text" 
                  placeholder="Company" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA]/50"
                />
                <textarea 
                  placeholder="Tell us about your project..." 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#64FFDA]/50 resize-none"
                ></textarea>
                <button 
                  type="submit"
                  className="w-full bg-[#64FFDA] text-[#0A192F] font-semibold py-4 rounded-lg hover:bg-[#64FFDA]/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050D1A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#64FFDA] to-[#00D4FF] flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-[#0A192F]" />
                </div>
                <span className="font-bold text-lg">Blueprint Creations LLC</span>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                Engineering intelligent ecosystems that simplify complexity and drive innovation across industries.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#portfolio" className="hover:text-[#64FFDA] transition-colors">Our Brands</a></li>
                <li><a href="#capabilities" className="hover:text-[#64FFDA] transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-[#64FFDA] transition-colors">Contact</a></li>
                <li><Link href="/careers" className="hover:text-[#64FFDA] transition-colors">Career Portal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-[#64FFDA] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#64FFDA] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-sm text-gray-500 mb-4 sm:mb-0">
              © 2026 Blueprint Creations LLC. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#64FFDA] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#64FFDA] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#64FFDA] transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
              
              {/* Admin Login */}
              <Link 
                href="/auth/login" 
                className="text-sm text-gray-500 hover:text-[#64FFDA] transition-colors border-l border-white/10 pl-6"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
