import React, { useState, useEffect, useRef } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let scrollFrame = null;

    const handleScroll = () => {
      if (scrollFrame) return;

      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        const nextScrolled = window.scrollY > 20;

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (scrollFrame) {
        cancelAnimationFrame(scrollFrame);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Profiles', href: '#profiles' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-12 lg:px-20 py-3 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-primary/20 shadow-xl'
          : 'bg-surface/90 backdrop-blur-sm'
      }`}
      id="navbar"
    >
      <a
        className="font-display-xl-mobile md:font-display-xl !text-[22px] md:!text-[26px] font-bold text-on-surface hover:text-primary transition-colors"
        href="#home"
      >
        Amit Kumar
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="font-mono-label text-[11px] uppercase text-on-surface-variant hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary/50"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Action Button */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={onOpenChat}
          className="flex items-center gap-2 px-5 py-2 glass-panel text-on-surface rounded-full hover:text-primary transition-all duration-300 font-mono-label text-xs uppercase glow-hover scale-95 active:scale-90"
        >
          <Bot size={16} className="text-secondary" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-on-surface p-2 hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-outline-variant/20 py-6 px-6 flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono-label text-sm uppercase text-on-surface-variant hover:text-primary transition-colors py-2 border-b border-primary/10"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenChat();
            }}
            className="mt-2 flex items-center justify-center gap-2 py-3 bg-primary text-on-primary font-mono-label text-xs uppercase rounded-full shadow-lg"
          >
            <Bot size={18} />
            Ask Amit AI
          </button>
        </div>
      )}
    </nav>
  );
}
