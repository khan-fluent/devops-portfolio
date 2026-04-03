import { useState } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const headerRef = useScrollAnimation('fadeUp');
  const gridRef = useScrollAnimation('fadeUp', { duration: 0.8, start: 'top 80%' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setFeedback({ type: 'success', text: 'Message sent successfully! I will get back to you soon.' });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to send message. Please try again or reach out directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact__header" ref={headerRef}>
          <p className="section__label">Get in Touch</p>
          <h2 className="section__title">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="section__subtitle">
            Have a project in mind or want to discuss infrastructure? I would love to hear from you.
          </p>
        </div>

        <div className="contact__grid" ref={gridRef}>
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className="contact__input"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className="contact__input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="contact__textarea"
                name="message"
                placeholder="Tell me about your project or question..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            {feedback && (
              <div className={`contact__feedback contact__feedback--${feedback.type}`}>
                {feedback.text}
              </div>
            )}

            <button className="contact__submit" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>

          <div className="contact__side">
            <div>
              <h3 className="contact__side-title">Direct Contact</h3>
              <p className="contact__side-text">
                Prefer to reach out directly? Connect with me through any of these channels.
              </p>
            </div>

            <div className="contact__direct-links">
              <a href="mailto:hello@faisal.dev" className="contact__direct-link">
                <div className="contact__direct-link-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact__direct-link-info">
                  <span className="contact__direct-link-label">Email</span>
                  <span className="contact__direct-link-value">hello@faisal.dev</span>
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__direct-link"
              >
                <div className="contact__direct-link-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="contact__direct-link-info">
                  <span className="contact__direct-link-label">LinkedIn</span>
                  <span className="contact__direct-link-value">linkedin.com/in/faisal</span>
                </div>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__direct-link"
              >
                <div className="contact__direct-link-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div className="contact__direct-link-info">
                  <span className="contact__direct-link-label">GitHub</span>
                  <span className="contact__direct-link-value">github.com/faisal</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
