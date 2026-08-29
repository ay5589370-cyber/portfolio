import React, { useState } from 'react';
import { ExternalLink, Cpu, Check } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import CpuVisualizerModal from './CpuVisualizerModal';

export default function Projects() {
  const [cpuModalOpen, setCpuModalOpen] = useState(false);

  const getProjectImage = (id) => {
    if (id === 'studymind-ai') return '/studymind.jpg';
    if (id === 'cpu-visualizer') return '/cpu-visualizer.jpg';
    return '/profile.jpg';
  };

  return (
    <section id="projects" className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <div>
            <p className="font-mono-label text-xs uppercase text-primary mb-2">
              Portfolio
            </p>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
              Selected Work.
            </h2>
          </div>
          <p className="text-on-surface-variant text-sm sm:text-base max-w-3xl mt-3">
            Practical web applications that combine AI workflows, interface design, and core computer science concepts.
          </p>
        </div>

        <div className="space-y-7 md:space-y-8">
          {portfolioData.projects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={project.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 items-center fade-in-up"
              >
                {/* Image Card */}
                <div
                  className={`md:col-span-7 group relative ${
                    isEven ? 'order-1' : 'order-1 md:order-2'
                  }`}
                >
                  <div className="absolute -inset-3 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-700 rounded-3xl -z-10 bg-primary/20"></div>
                  <div className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-xl aspect-[16/10] md:aspect-[16/9] bg-surface-container/70">
                    <img
                      src={getProjectImage(project.id)}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-700 ease-out opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-80"></div>

                    {/* Badge on Image */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                      <span className="px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-mono-label font-bold rounded-full bg-surface-container/80 text-primary border border-primary/30 backdrop-blur-md shadow-lg">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div
                  className={`md:col-span-5 flex flex-col gap-4 sm:gap-5 ${
                    isEven ? 'order-2 md:pl-4' : 'order-2 md:order-1 md:pr-4'
                  }`}
                >
                  <h3 className="font-headline-lg-mobile text-xl sm:text-2xl md:text-3xl font-bold text-on-surface hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-body-md text-on-surface-variant text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-mono-label text-xs uppercase text-primary">
                      Key Highlights
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {project.features.slice(0, 4).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
                          <Check size={15} className="text-success flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono-label rounded-full bg-surface-container/70 text-on-surface-variant border border-primary/20 hover:border-primary/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4">
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-on-primary font-mono-label text-[10px] sm:text-xs uppercase rounded-full hover:bg-inverse-primary transition-all duration-300 flex items-center gap-2 font-bold shadow-lg shadow-black/20"
                      >
                        <ExternalLink size={15} /> Live Demo
                      </a>
                    )}

                    {project.id === 'cpu-visualizer' && (
                      <button
                        onClick={() => setCpuModalOpen(true)}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 glass-panel text-on-surface font-mono-label text-[10px] sm:text-xs uppercase rounded-full hover:border-secondary/50 hover:text-secondary transition-all duration-300 flex items-center gap-2"
                      >
                        <Cpu size={16} className="text-secondary" /> Launch Simulator
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CpuVisualizerModal isOpen={cpuModalOpen} onClose={() => setCpuModalOpen(false)} />
    </section>
  );
}
