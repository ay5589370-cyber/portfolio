import React from 'react';
import { MapPin, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  return (
    <section id="about" className="px-4 sm:px-6 md:px-20 pt-2 pb-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <p className="font-mono-label text-xs uppercase text-primary mb-2">
            About Me
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
            Building with purpose.
          </h2>
        </div>

        <div className="glass-panel p-4 sm:p-6 md:p-7 rounded-2xl border border-primary/20 flex flex-col gap-4 sm:gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] gap-4 sm:gap-6 items-start">
            <div className="flex flex-col gap-4 sm:gap-5">
              <p className="text-on-surface leading-relaxed text-sm sm:text-base md:text-lg">
                I'm <strong className="text-primary">Amit Yadav</strong>, a Computer Science undergraduate focused on building modern web applications that combine <strong className="text-primary">clean design, solid engineering, and AI</strong>.
              </p>
              <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                I work with <strong className="text-secondary">React, Node.js, serverless APIs, and AI integrations</strong>, with a focus on writing maintainable code and creating experiences that are simple, fast, and useful.
              </p>
              <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                My recent work includes <strong className="text-primary">StudyMind AI</strong>, an AI-powered learning platform, and a <strong className="text-secondary">CPU Scheduling Visualizer</strong> that turns operating system concepts into interactive simulations.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="border-l-4 border-l-primary pl-3 sm:pl-4 py-1">
                <div className="text-2xl sm:text-3xl font-bold text-on-surface font-display-xl">10+</div>
                <div className="text-on-surface-variant text-xs uppercase font-mono-label mt-1">
                  AI Features & Tools
                </div>
              </div>
              <div className="border-l-4 border-l-primary pl-3 sm:pl-4 py-1">
                <div className="text-2xl sm:text-3xl font-bold text-on-surface font-display-xl">2028</div>
                <div className="text-on-surface-variant text-xs uppercase font-mono-label mt-1">
                  B.Tech CSE
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-6 pt-2 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span>{portfolioData.personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              <span className="break-all">{portfolioData.personalInfo.email}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
