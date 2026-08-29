import React from 'react';
import { CheckCircle2, Code2, Server, Terminal, Cpu, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Skills() {
  const getCategoryIcon = (category) => {
    if (category.includes('Frontend')) return <Code2 size={20} className="text-secondary" />;
    if (category.includes('Backend')) return <Server size={20} className="text-primary" />;
    if (category.includes('Languages')) return <Terminal size={20} className="text-secondary" />;
    if (category.includes('Core')) return <Cpu size={20} className="text-primary" />;
    return <Sparkles size={20} className="text-primary" />;
  };

  return (
    <section id="skills" className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <p className="font-mono-label text-xs uppercase text-primary mb-2">
            Expertise
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
            Tools I Use.
          </h2>
          <p className="font-body-md text-on-surface-variant mt-3 text-sm sm:text-base max-w-3xl">
            A focused stack for building responsive frontends, API-backed features, and learning tools grounded in computer science fundamentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioData.skills.map((skillGroup, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 sm:p-5 rounded-2xl hover:border-primary/40 transition-all duration-300 glow-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container/70 flex items-center justify-center border border-primary/20">
                    {getCategoryIcon(skillGroup.category)}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-on-surface">{skillGroup.category}</h3>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {skillGroup.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-on-surface-variant text-xs sm:text-sm">
                      <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
