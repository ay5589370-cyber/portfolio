import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Profiles from './components/Profiles';
import Contact from './components/Contact';
import AIAssistant from './components/AIAssistant';
import FrameCanvasBackground from './components/FrameCanvasBackground';
import { portfolioData } from './data/portfolioData';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface relative isolate">
      <FrameCanvasBackground />

      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1 relative z-10">
        <Hero onOpenChat={() => setChatOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Profiles />
        <Contact />
      </main>

      <footer className="w-full py-7 sm:py-8 px-4 sm:px-6 md:px-20 bg-surface/90 border-t border-primary/20 relative z-10 overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent -z-10"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="text-center md:text-left">
            <a href="#home" className="font-mono-label font-bold text-on-surface text-sm uppercase">
              {portfolioData.personalInfo.name}
            </a>
            <p className="mt-1 text-sm text-on-surface-variant">
              React, AI tools, serverless APIs, and interactive CS visualizers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <a
              href={`mailto:${portfolioData.personalInfo.email}`}
              className="max-w-full break-all rounded-full border border-primary/20 bg-surface-container/70 px-3 sm:px-4 py-2 text-on-surface hover:border-primary/50 hover:text-primary transition-colors"
            >
              {portfolioData.personalInfo.email}
            </a>
            <a
              href={portfolioData.profiles.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-primary/20 bg-surface-container/70 px-4 py-2 text-on-surface hover:border-primary/50 hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <span className="text-on-surface-variant/60">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>

      <AIAssistant isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  );
}
