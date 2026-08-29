import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Send, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const EMAILJS_SERVICE_ID = 'service_mvjc47j';
const EMAILJS_TEMPLATE_ID = 'template_rvnrkik';
const EMAILJS_PUBLIC_KEY = 'YbzPjoc_xp8mbyIln';
const CONTACT_TO_EMAIL = 'ay5589370@gmail.com';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        reply_to: email,
        to_email: CONTACT_TO_EMAIL,
        message
      }, {
        publicKey: EMAILJS_PUBLIC_KEY
      });

      setSuccessMessage(`Thanks ${name}. Your message has been sent.`);
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      setError('Message could not be sent right now. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-4 sm:px-6 md:px-20 py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5 md:mb-6">
          <p className="font-mono-label text-xs uppercase text-primary mb-2">
            Contact
          </p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl sm:text-3xl md:text-4xl text-on-surface text-glow font-bold">
            Let's Connect.
          </h2>
          <p className="font-body-md text-on-surface-variant mt-3 text-sm sm:text-base max-w-3xl">
            The fastest way to reach me is email. You can also use the portfolio assistant for quick context about my projects and skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="md:col-span-5 glass-panel p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-on-surface">Contact Details</h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-container/70 flex items-center justify-center text-secondary border border-primary/20 flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono-label text-on-surface-variant block uppercase">Email Address</span>
                    <a href={`mailto:${portfolioData.personalInfo.email}`} className="font-medium text-on-surface hover:text-primary transition-colors text-sm md:text-base break-all">
                      {portfolioData.personalInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-container/70 flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono-label text-on-surface-variant block uppercase">Location</span>
                    <div className="font-medium text-on-surface text-sm md:text-base">
                      {portfolioData.personalInfo.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-surface-container/70 border border-primary/20">
                <h4 className="text-xs font-mono-label text-primary uppercase mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> Open for Roles
                </h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  {portfolioData.personalInfo.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 glass-panel p-4 sm:p-6 rounded-2xl">
            {submitted ? (
              <div className="text-center py-10 sm:py-12 space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-8 sm:size-9" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-surface">Message Sent</h3>
                <p className="text-on-surface-variant text-sm sm:text-base">
                  {successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="alert-error rounded-xl border px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-xs font-mono-label uppercase text-on-surface-variant block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    disabled={submitting}
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-container/70 border border-primary/20 rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-label uppercase text-on-surface-variant block mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    disabled={submitting}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-container/70 border border-primary/20 rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono-label uppercase text-on-surface-variant block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    maxLength={4000}
                    disabled={submitting}
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-container/70 border border-primary/20 rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 sm:py-3.5 bg-primary text-on-primary font-mono-label text-[10px] sm:text-xs uppercase rounded-full hover:bg-inverse-primary transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg shadow-black/20"
                >
                  <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
