import React, { useEffect, useRef, useState } from 'react';

/* ── Floating particle canvas ── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? 260 : 220,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha})`;
        ctx.fill();
      });
      // draw connecting lines
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

/* ── Typing animation hook ── */
const useTyping = (words, speed = 90, pause = 1800) => {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const word = words[index];
    let timeout;
    if (!deleting && sub <= word.length) {
      setText(word.slice(0, sub));
      timeout = setTimeout(() => setSub(s => s + 1), speed);
    } else if (!deleting && sub > word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && sub >= 0) {
      setText(word.slice(0, sub));
      timeout = setTimeout(() => setSub(s => s - 1), speed / 2);
    } else {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      setSub(0);
    }
    return () => clearTimeout(timeout);
  }, [sub, deleting, index, words, speed, pause]);

  return text;
};

/* ── Feature card ── */
const FeatureCard = ({ icon, title, desc, gradient, delay }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all duration-500 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient} shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/0 to-blue-600/0 group-hover:from-violet-600/5 group-hover:to-blue-600/5 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

/* ── Step card ── */
const StepCard = ({ num, title, desc, delay }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-violet-900/40">
        {num}
      </div>
      <div>
        <h4 className="text-white font-bold text-base mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════════ */
const HomePage = ({ onGetStarted, onLogin, onSignUp }) => {
  const typed = useTyping([
    'Backend Developer',
    'Data Engineer',
    'Frontend Developer',
    'Full-Stack Engineer',
    'DevOps Engineer',
  ]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const features = [
    {
      gradient: 'from-violet-600/80 to-purple-700/80',
      title: 'AI-Powered Analysis',
      desc: 'Our AI reads your resume and delivers deep, role-specific insights in seconds — not hours.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      gradient: 'from-blue-600/80 to-cyan-600/80',
      title: 'Skill Gap Detection',
      desc: 'Instantly see which skills you have and which ones you need to land your dream job.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      gradient: 'from-emerald-600/80 to-teal-600/80',
      title: 'Match Score',
      desc: 'Get a clear percentage score showing how well your resume aligns with any job role.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      gradient: 'from-rose-600/80 to-pink-600/80',
      title: 'PDF Resume Support',
      desc: 'Upload your PDF resume directly — no copy-pasting required. We handle the extraction.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      gradient: 'from-amber-600/80 to-orange-600/80',
      title: 'Instant Results',
      desc: 'No waiting. Get your full analysis with actionable recommendations in under 10 seconds.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      gradient: 'from-indigo-600/80 to-violet-600/80',
      title: 'Professional Summary',
      desc: 'Receive a detailed professional narrative written by AI — ready to use in interviews.',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">
      <ParticleCanvas />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a14]/90 backdrop-blur-md shadow-lg shadow-black/30 border-b border-white/5' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">IQ</span>
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
          </div>
          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200"
            >
              Log In
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-sm font-semibold animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Resume Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight animate-slide-up">
            Land Your Dream<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400">
              {typed}
              <span className="inline-block w-0.5 h-[0.9em] bg-violet-400 ml-1 animate-blink align-middle" />
            </span>
            <br />
            <span className="text-gray-200">Role</span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            Upload your resume and get an instant AI analysis — match score, skill gaps, and a professional summary. Know exactly what to improve before your next application.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '350ms' }}>
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-lg shadow-2xl shadow-violet-900/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze My Resume — Free
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
            </button>
            <button
              onClick={onSignUp}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/25 text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Create Free Account
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Results in under 10 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PDF & text supported
            </span>
          </div>

          {/* Scroll indicator */}
          <div className="pt-10 flex justify-center animate-bounce">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-extrabold text-white mt-2 mb-3">Everything You Need to<br />Get Hired Faster</h2>
            <p className="text-gray-400 max-w-xl mx-auto">ResumeIQ combines AI intelligence with career science to give you an unfair advantage.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">How It Works</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 mb-8">From Upload to<br />Insights in 3 Steps</h2>
              <div className="space-y-8">
                <StepCard num={1} delay={0} title="Upload Your Resume" desc="Drop your PDF or paste your resume text. We support all standard resume formats." />
                <StepCard num={2} delay={120} title="Choose Your Target Role" desc="Select from Backend Developer, Data Engineer, Frontend Developer and more." />
                <StepCard num={3} delay={240} title="Get Your AI Analysis" desc="Receive your match score, identified skill gaps, and a detailed AI report instantly." />
              </div>
              <button
                onClick={onGetStarted}
                className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-violet-900/30"
              >
                Try It Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mock UI Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-3xl blur-2xl" />
              <div className="relative bg-[#13131f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header bar */}
                <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />
                <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">ResumeIQ Analysis</span>
                </div>
                <div className="p-6 space-y-5">
                  {/* Score ring mock */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="url(#grad)" strokeWidth="8"
                          strokeDasharray="201" strokeDashoffset="80" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black text-white">60%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Match Score</div>
                      <div className="text-emerald-400 text-sm mt-0.5">👍 Good Match</div>
                      <div className="text-xs text-gray-500 mt-1">Backend Developer</div>
                    </div>
                  </div>
                  {/* Skills */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Matched Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Java', 'Spring Boot', 'MySQL', 'REST API'].map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills to Develop</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Kubernetes', 'Redis'].map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  {/* AI summary mock */}
                  <div className="rounded-xl bg-violet-900/20 border border-violet-500/20 p-4">
                    <div className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2">ResumeIQ AI's Take</div>
                    <div className="text-xs text-gray-400 leading-relaxed">Strong backend fundamentals with Java and Spring Boot. Focus on cloud-native technologies to unlock senior roles...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/60 to-blue-900/40 border border-violet-500/25 p-12">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Get Hired?</h2>
              <p className="text-gray-300 mb-8 text-lg">Join thousands of job seekers who've improved their resumes with ResumeIQ.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onSignUp}
                  className="px-8 py-4 rounded-2xl bg-white text-[#0a0a14] font-extrabold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
                >
                  Start for Free
                </button>
                <button
                  onClick={onLogin}
                  className="px-8 py-4 rounded-2xl border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-400">ResumeIQ</span>
          </div>
          <p>© {new Date().getFullYear()} ResumeIQ. Powered by ResumeIQ AI.</p>
          <div className="flex gap-5">
            <button onClick={onLogin} className="hover:text-gray-300 transition-colors">Log In</button>
            <button onClick={onSignUp} className="hover:text-gray-300 transition-colors">Sign Up</button>
          </div>
        </div>
      </footer>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-fade-in { animation: fade-in 0.8s ease both; }
        .animate-slide-up { animation: slide-up 0.8s ease both; }
        .animate-blink { animation: blink 1s step-end infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;

