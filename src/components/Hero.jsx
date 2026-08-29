import React from 'react';
import { Bot, Github, Code, ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Hero({ onOpenChat }) {
  return (
    <section
      className="relative min-h-[44vh] sm:min-h-[78vh] flex items-start sm:items-center justify-center px-3.5 sm:px-6 md:px-20 pt-16 sm:pt-28 pb-0 sm:pb-12 overflow-hidden"
      id="home"
    >
      {/* Main Hero Content */}
      <div className="relative w-full z-10 max-w-6xl mx-auto grid grid-cols-[minmax(0,1fr)_clamp(5.3rem,27vw,18rem)] min-[390px]:grid-cols-[minmax(0,1fr)_clamp(5.8rem,27vw,18rem)] min-[430px]:grid-cols-[minmax(0,1fr)_clamp(6.4rem,28vw,18rem)] sm:grid-cols-[minmax(0,1fr)_clamp(11rem,25vw,19rem)] gap-2 min-[430px]:gap-2.5 sm:gap-8 lg:gap-12 items-start sm:items-center fade-in-up">
        <div className="min-w-0 space-y-2 min-[430px]:space-y-2.5 sm:space-y-4 text-left border-l border-primary/50 pl-3 min-[430px]:pl-4 sm:pl-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface-container/70 border border-primary/20 text-on-surface font-mono-label text-[9px] min-[430px]:text-[10px] sm:text-xs uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success flex-shrink-0"></span>
            <span className="truncate">
              Full-Stack Developer &bull; AI &amp; Web
            </span>
          </div>

          <h1 className="font-display-xl-mobile md:font-display-xl text-[1.35rem] min-[390px]:text-[1.55rem] min-[430px]:text-[1.95rem] sm:text-4xl lg:text-5xl font-bold leading-[0.98] sm:leading-[1.04] text-on-surface max-w-4xl">
            <span className="text-on-surface">Code.</span>{' '}
            <span className="text-primary">Create.</span>{' '}
            <span className="text-secondary">Innovate.</span>
          </h1>

          <div className="max-w-2xl border-l-2 border-secondary/70 pl-2.5 sm:pl-4">
            <p className="font-body-lg text-on-surface-variant leading-[1.28] sm:leading-relaxed text-[11px] min-[390px]:text-xs min-[430px]:text-sm sm:text-lg">
              I'm <span className="text-primary font-semibold">Amit Yadav</span>, a Full-Stack Developer building responsive web experiences, AI-powered tools, and practical software products with <span className="text-secondary font-semibold">React, Node.js, and modern AI APIs</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-[10px] min-[430px]:text-[11px] sm:text-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <MapPin size={12} className="text-primary sm:size-[14px]" />
              Punjab, India
            </span>
            <span className="text-on-surface-variant/60">&bull;</span>
            <span>Open to internships & developer opportunities</span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-[430px]:gap-2 sm:gap-4 pt-0 sm:pt-2 items-center">
            <a
              className="px-2.5 min-[430px]:px-3 sm:px-6 py-1.5 min-[430px]:py-2 sm:py-3 bg-primary hover:bg-inverse-primary text-on-primary font-mono-label text-[9px] min-[430px]:text-[10px] sm:text-xs uppercase rounded-full flex items-center gap-1 sm:gap-2 shadow-lg shadow-black/20 transition-all duration-300 font-bold"
              href="#projects"
            >
              View Projects <ArrowDown size={12} className="sm:size-[14px]" />
            </a>

            <button
              onClick={onOpenChat}
              className="px-2.5 min-[430px]:px-3 sm:px-6 py-1.5 min-[430px]:py-2 sm:py-3 bg-surface-container/70 hover:bg-surface-container-high text-on-surface border border-primary/20 hover:border-secondary/40 font-mono-label text-[9px] min-[430px]:text-[10px] sm:text-xs uppercase rounded-full backdrop-blur-sm flex items-center gap-1 sm:gap-2 transition-all duration-300"
            >
              <Bot size={12} className="text-secondary sm:size-[14px]" />
              Ask Amit AI
            </button>

            <a
              className="px-2.5 min-[430px]:px-3 sm:px-6 py-1.5 min-[430px]:py-2 sm:py-3 bg-surface-container/70 hover:bg-surface-container-high text-on-surface border border-primary/20 hover:border-primary/40 font-mono-label text-[9px] min-[430px]:text-[10px] sm:text-xs uppercase rounded-full backdrop-blur-sm flex items-center gap-1 sm:gap-2 transition-all duration-300"
              href="#contact"
            >
              Contact Me <ArrowUpRight size={12} className="sm:size-[14px]" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] min-[430px]:text-[11px] sm:text-xs font-mono-label uppercase">
            <a
              href={portfolioData.profiles.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors"
            >
              <Github size={13} className="sm:size-4" /> GitHub
            </a>
            <span className="text-on-surface-variant/60">&bull;</span>
            <a
              href={portfolioData.profiles.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-on-surface hover:text-secondary transition-colors"
            >
              <Code size={13} className="sm:size-4" /> LeetCode
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3 pt-0.5 sm:pt-3 max-w-2xl">
            <div className="rounded-xl bg-surface-container/70 border border-primary/20 backdrop-blur-sm p-2 sm:p-3">
              <p className="tech-label text-[10px] sm:text-xs uppercase text-primary font-bold">React.js</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">Frontend Development</p>
            </div>
            <div className="rounded-xl bg-surface-container/70 border border-primary/20 backdrop-blur-sm p-2 sm:p-3">
              <p className="tech-label text-[10px] sm:text-xs uppercase text-secondary font-bold">Node.js</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">Backend &amp; APIs</p>
            </div>
            <div className="rounded-xl bg-surface-container/70 border border-primary/20 backdrop-blur-sm p-2 sm:p-3">
              <p className="tech-label text-[10px] sm:text-xs uppercase text-secondary font-bold">AI</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">AI Integrations</p>
            </div>
            <div className="rounded-xl bg-surface-container/70 border border-primary/20 backdrop-blur-sm p-2 sm:p-3">
              <p className="tech-label text-[10px] sm:text-xs uppercase text-primary font-bold">CS</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">Visual Simulators</p>
            </div>
          </div>
        </div>

        <div className="relative ml-auto w-full max-w-none self-start sm:self-center mt-6 min-[430px]:mt-7 sm:mt-0">
          <div className="absolute -inset-1 sm:-inset-3 rounded-[22px] sm:rounded-[30px] border border-primary/20 bg-secondary/10 blur-md sm:blur-xl opacity-40 sm:opacity-55"></div>
          <div
            className="relative overflow-hidden rounded-[20px] sm:rounded-[26px] border border-primary/35 bg-surface/80 p-1 sm:p-2 shadow-lg sm:shadow-2xl"
            style={{ boxShadow: '0 10px 28px rgba(0, 0, 0, 0.38), 0 0 20px rgba(245, 184, 46, 0.10), 0 0 18px rgba(85, 221, 224, 0.08)' }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[16px] sm:rounded-[22px] bg-surface">
              <img
                src="/profile.png"
                alt={portfolioData.personalInfo.name}
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 28%' }}
              />
            </div>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-4 sm:left-4 sm:right-4 rounded-[14px] sm:rounded-[18px] border border-primary/25 bg-surface/85 px-2 sm:px-3.5 py-1 sm:py-2 backdrop-blur-md">
              <p className="truncate text-[8px] min-[430px]:text-[9px] sm:text-sm font-semibold text-primary leading-tight">{portfolioData.personalInfo.name}</p>
              <p className="truncate text-[7px] min-[430px]:text-[8px] sm:text-xs text-on-surface leading-tight mt-0.5">Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
