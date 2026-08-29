import React from 'react';
import { Github, Code, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Profiles() {
  return (
    <section id="profiles" className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <p className="font-mono-label text-xs uppercase text-primary mb-2">
            Profiles
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
            Code Profiles.
          </h2>
          <p className="font-body-md text-on-surface-variant mt-3 text-sm sm:text-base max-w-3xl">
            Public profiles for reviewing code, projects, and algorithmic practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* GitHub Profile Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col justify-between hover:border-primary/40 transition-all duration-300 glow-hover">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface-container/70 flex items-center justify-center text-primary border border-primary/20 mb-3 sm:mb-4">
                <Github className="size-6 sm:size-[30px]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">GitHub</h3>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                Review project repositories, implementation style, and frontend/backend experiments.
              </p>
            </div>

            <a
              href={portfolioData.profiles.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 sm:py-3.5 bg-primary text-on-primary font-mono-label text-[10px] sm:text-xs uppercase rounded-full hover:bg-inverse-primary transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg shadow-black/20"
            >
              <ExternalLink size={16} /> Visit GitHub Profile
            </a>
          </div>

          {/* LeetCode Profile Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col justify-between hover:border-primary/40 transition-all duration-300 glow-hover">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface-container/70 flex items-center justify-center text-secondary border border-primary/20 mb-3 sm:mb-4">
                <Code className="size-6 sm:size-[30px]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">LeetCode</h3>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
                Data Structures and Algorithms practice with a focus on improving problem-solving speed and accuracy.
              </p>
            </div>

            <a
              href={portfolioData.profiles.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 sm:py-3.5 glass-panel text-secondary font-mono-label text-[10px] sm:text-xs uppercase rounded-full hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-300 flex items-center justify-center gap-2 font-bold border border-secondary/30"
            >
              <ExternalLink size={16} /> Visit LeetCode Profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
