import React from 'react';
import { BookOpen, Calendar, GraduationCap, Lightbulb } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <p className="font-mono-label text-xs uppercase text-primary mb-2">
            Academics
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
            Learn. Build. Apply.
          </h2>
          <p className="font-body-md text-on-surface-variant mt-3 text-sm sm:text-base max-w-3xl">
            Building a strong foundation in computer science while applying concepts through real-world projects and problem solving.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <div className="glass-panel p-4 sm:p-6 md:p-7 rounded-2xl border-l-4 border-l-primary hover:border-primary/40 transition-all duration-300 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface">
                  B.Tech in Computer Science &amp; Engineering
                </h3>
                <div className="text-primary font-mono-label text-xs sm:text-sm font-semibold mt-2 flex items-center gap-2">
                  <GraduationCap size={18} />
                  Chandigarh University
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-container/70 text-on-surface-variant font-mono-label text-[10px] sm:text-xs border border-primary/20 w-fit">
                <Calendar size={14} className="text-primary" />
                2024 - 2028
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl bg-surface-container/70 border border-primary/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-primary font-mono-label text-xs uppercase font-bold mb-2">
                  <BookOpen size={16} />
                  Core Focus
                </div>
                <p className="text-on-surface-variant text-xs sm:text-sm md:text-base leading-relaxed">
                  Data Structures &amp; Algorithms &bull; Operating Systems &bull; DBMS &bull; Web Development
                </p>
              </div>

              <div className="rounded-xl bg-surface-container/70 border border-primary/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-secondary font-mono-label text-xs uppercase font-bold mb-2">
                  <Lightbulb size={16} />
                  Beyond Academics
                </div>
                <p className="text-on-surface-variant text-xs sm:text-sm md:text-base leading-relaxed">
                  Turning classroom concepts into practical projects and strengthening problem-solving skills through consistent coding practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
