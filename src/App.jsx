import { useEffect, useMemo, useRef, useState } from 'react';

const revealBase = 'translate-y-0 opacity-100 transition-all duration-1000 ease-out';
const revealHidden = 'translate-y-10 opacity-0 transition-all duration-1000 ease-out';

function TiltCard({ children, className = '', onClick }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)');

  const handleMouseMove = (event) => {
    const el = cardRef.current;
    if (!el || window.innerWidth < 1024) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;
    setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.012)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      <div style={{ transform: 'translateZ(22px)' }}>{children}</div>
    </div>
  );
}

function ProjectTitlePanel({ project, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] ${compact ? 'min-h-[190px] p-6' : 'min-h-[280px] p-8'}`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="w-fit rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300 sm:text-xs">
          Featured Project
        </span>
        <div className="mt-10">
          <h3 className={`${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-bold leading-tight text-white`}>
            {project.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [activeProject, setActiveProject] = useState(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setIsCommandOpen(false);
        setActiveProject(null);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-reveal');
            if (id) setVisibleSections((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const skills = {
    frontend: ['React', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
    backend: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'Express', 'REST APIs', 'JWT'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL', 'Schema Design', 'Query Optimization'],
    cloud: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'Git', 'CloudWatch'],
  };

  const experience = {
    company: 'Tata Consultancy Services',
    role: 'Software Engineer',
    period: 'Aug 2021 – Apr 2023',
    location: 'Hyderabad, India',
    highlights: [
      'Developed and maintained Java and Python backend services and REST APIs serving 50+ downstream consumers across 3 product teams.',
      'Built AWS-backed processing systems handling 10M+ daily records with 99.5% uptime, retry logic, health checks, dead-letter handling, and monitoring.',
      'Integrated 5+ upstream data sources into PostgreSQL and improved query latency by 30% through schema and index optimization.',
      'Supported CI/CD workflows with 50+ automated checks and helped reduce incident rate by 40% after launch.',
    ],
  };

  const projects = [
    {
      title: 'HireLens — AI Resume Intelligence Platform',
      stack: ['React', 'FastAPI', 'PostgreSQL', 'OpenAI API', 'TailwindCSS'],
      description:
        'AI-powered platform that analyzes resumes, scores quality, compares them with job descriptions, and generates personalized improvement suggestions including rewritten bullet points and ATS keyword optimization.',
      impact: ['AI resume feedback', 'ATS keyword optimization', 'Interactive analytics dashboard'],
      architecture: ['React Dashboard', 'FastAPI AI Services', 'OpenAI API', 'PostgreSQL Storage'],
      liveUrl: 'https://hire-lens-lemon.vercel.app/',
      githubUrl: 'https://github.com/GowthamU7/HireLens',
    },
    {
      title: 'Scalable URL Shortener',
      stack: ['FastAPI', 'PostgreSQL', 'Redis', 'React', 'TypeScript', 'Docker'],
      description:
        'Built and deployed a production-style URL shortening platform with caching, click analytics, API documentation, and responsive frontend experience.',
      impact: ['Fast redirects', 'Analytics dashboard', 'Dockerized deployment'],
      architecture: ['React Frontend', 'FastAPI API Layer', 'Redis Cache', 'PostgreSQL Storage'],
      liveUrl: 'https://urlshortener-fe-imyv.vercel.app',
      githubUrl: 'https://github.com/GowthamU7',
    },
    {
      title: 'Job Tracker',
      stack: ['FastAPI', 'PostgreSQL', 'JWT', 'React', 'TypeScript', 'Recharts'],
      description:
        'Designed a full-stack application for managing applications, tracking progress, and analyzing job search conversion rates through visual dashboards.',
      impact: ['JWT auth', 'Protected CRUD APIs', 'Analytics insights'],
      architecture: ['React Dashboard', 'FastAPI Services', 'JWT Auth', 'PostgreSQL Analytics'],
    },
    {
      title: 'Multiplayer TicTacToe',
      stack: ['Node.js', 'Express', 'React', 'MongoDB', 'Socket.IO', 'Docker'],
      description:
        'Built a real-time multiplayer web app with WebSocket synchronization, authentication, and role-based access patterns across environments.',
      impact: ['Real-time gameplay', 'Sub-100ms sync', 'CI/CD ready'],
      architecture: ['React Client', 'Express API', 'Socket.IO Realtime', 'MongoDB State'],
    },
    {
      title: 'Task Manager REST API',
      stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt'],
      description:
        'Created a clean REST API with authentication, user-scoped data ownership, filtering, pagination, sorting, validation, and strong separation of concerns.',
      impact: ['User auth', 'CRUD operations', 'Production-style API structure'],
      architecture: ['Express API', 'JWT Auth', 'Validation Layer', 'MongoDB Collections'],
    },
  ];

  const commandItems = useMemo(
    () => [
      { label: 'Open GitHub', href: 'https://github.com/GowthamU7', external: true },
      { label: 'Open LinkedIn', href: 'https://www.linkedin.com/in/ugowthamss/', external: true },
      { label: 'Go to About', href: '#about' },
      { label: 'Go to Skills', href: '#skills' },
      { label: 'Go to Experience', href: '#experience' },
      { label: 'Go to Projects', href: '#projects' },
      { label: 'Go to Contact', href: '#contact' },
    ],
    []
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030303] text-white">
      <div
        className="fixed inset-0 -z-10 opacity-90"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139,92,246,0.22), transparent 20%), radial-gradient(circle at 20% 15%, rgba(59,130,246,0.16), transparent 22%), radial-gradient(circle at 85% 82%, rgba(168,85,247,0.18), transparent 18%), #030303`,
        }}
      />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <div className="w-full px-0 sm:px-3 lg:px-4">
        <div className="min-h-screen w-full overflow-hidden border-y border-white/10 bg-black/55 shadow-[0_30px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:my-3 sm:rounded-[28px] sm:border">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600/20 text-base font-bold text-violet-300 ring-1 ring-violet-500/30 sm:h-11 sm:w-11 sm:text-lg">
                  <span className="absolute inset-0 animate-pulse rounded-2xl bg-violet-500/10" />
                  <span className="relative">G</span>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-white sm:text-base">Gowtham Ullangula</p>
                  <p className="text-[11px] text-slate-400 sm:text-xs">Software Engineer Portfolio</p>
                </div>
              </div>

              <nav className="hidden items-center gap-6 text-sm text-slate-300 xl:flex">
                <a href="#about" className="transition hover:text-white">About</a>
                <a href="#skills" className="transition hover:text-white">Skills</a>
                <a href="#experience" className="transition hover:text-white">Experience</a>
                <a href="#projects" className="transition hover:text-white">Projects</a>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 md:block"
                >
                  Ctrl + K
                </button>
                <a
                  href="#contact"
                  className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.03] hover:bg-violet-500 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </header>

          <section
            data-reveal="hero"
            className={`relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-[1600px] items-center gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 ${visibleSections.hero ? revealBase : revealHidden}`}
          >
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Available for SWE opportunities
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-[5.5rem]">
                Building
                <span className="bg-gradient-to-r from-white via-violet-200 to-violet-500 bg-clip-text text-transparent"> scalable systems </span>
                and interactive products that feel premium.
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:text-lg">
                Java, Python, React, FastAPI, Spring Boot, AWS, and production-minded engineering. I build backend-heavy applications with strong architecture, polished UI, and real-world deployment workflows.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="#projects"
                  className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,0.4)] transition hover:scale-[1.03] hover:bg-violet-500 sm:px-6"
                >
                  Explore Projects
                </a>
                <a
                  href="#experience"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
                >
                  View Experience
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '2+', label: 'Years Experience' },
                  { value: '10M+', label: 'Daily Records Processed' },
                  { value: '50+', label: 'Downstream Consumers' },
                ].map((item) => (
                  <TiltCard
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-violet-500/20 hover:bg-white/[0.06]"
                  >
                    <p className="text-2xl font-bold text-white sm:text-3xl">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </TiltCard>
                ))}
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center py-4 lg:py-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[280px] w-[280px] animate-spin rounded-full border border-violet-500/15 [animation-duration:18s] sm:h-[340px] sm:w-[340px] lg:h-[420px] lg:w-[420px]" />
                <div className="absolute h-[220px] w-[220px] animate-spin rounded-full border border-cyan-400/15 [animation-direction:reverse] [animation-duration:14s] sm:h-[280px] sm:w-[280px] lg:h-[330px] lg:w-[330px]" />
                <div className="absolute h-[165px] w-[165px] rounded-full border border-white/10 sm:h-[210px] sm:w-[210px] lg:h-[240px] lg:w-[240px]" />
              </div>

              {[
                { label: 'FastAPI', className: 'left-0 top-10 sm:top-16' },
                { label: 'AWS', className: 'right-2 top-3 sm:right-6 sm:top-6' },
                { label: 'React', className: 'right-0 bottom-16 sm:bottom-24' },
                { label: 'PostgreSQL', className: 'left-4 bottom-4 sm:left-10 sm:bottom-10' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`absolute ${badge.className} rounded-full border border-white/10 bg-black/70 px-3 py-2 text-[11px] font-medium text-slate-200 shadow-lg backdrop-blur-md transition hover:scale-105 sm:px-4 sm:text-xs`}
                >
                  {badge.label}
                </div>
              ))}

              <TiltCard className="relative z-10 w-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_0_80px_rgba(124,58,237,0.18)] backdrop-blur-xl sm:rounded-[34px] sm:p-6">
                <div className="relative overflow-hidden rounded-[24px] border border-violet-500/10 bg-[#09090f] px-5 py-8 text-center sm:px-6 sm:py-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.22),transparent_42%)]" />
                  <div className="relative z-10">
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 p-[2px] shadow-[0_0_60px_rgba(124,58,237,0.35)] sm:h-56 sm:w-56 lg:h-64 lg:w-64">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d0d14] text-5xl font-bold text-white sm:text-7xl">
                      </div>
                    </div>

                    <div className="mx-auto mt-5 max-w-md rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur-md sm:text-base">
                      Backend-first engineer shipping clean APIs, resilient systems, and recruiter-ready product experiences.
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                      {['Java', 'Python', 'Cloud', 'APIs'].map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </section>

          <section
            data-reveal="techbar"
            className={`border-t border-white/10 ${visibleSections.techbar ? revealBase : revealHidden}`}
          >
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-3 px-4 py-5 text-center sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-10">
              {['React', 'Spring Boot', 'FastAPI', 'AWS', 'PostgreSQL', 'Docker'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4 text-sm font-medium text-slate-400 transition hover:border-violet-500/20 hover:text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section id="about" data-reveal="about" className={`${visibleSections.about ? revealBase : revealHidden}`}>
            <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-20">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-violet-400 sm:text-sm">About</p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Practical engineering, but presented with strong product taste</h2>
                <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:text-lg">
                  I enjoy building software that is technically sound and visually strong. My background includes backend services, distributed workflows, SQL optimization, cloud infrastructure, responsive interfaces, and production-minded development practices. I like projects that feel real, not just academic.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TiltCard className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-violet-500/20 hover:bg-white/[0.06]">
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">Louisville, KY</p>
                </TiltCard>
                <TiltCard className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-violet-500/20 hover:bg-white/[0.06]">
                  <p className="text-sm text-slate-500">Open To</p>
                  <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">Relocation</p>
                </TiltCard>
                <TiltCard className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-violet-500/20 hover:bg-white/[0.06] sm:col-span-2">
                  <p className="text-sm text-slate-500">Current Goal</p>
                  <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">Software Engineer, Backend Engineer, Full Stack Engineer</p>
                </TiltCard>
              </div>
            </div>
          </section>

          <section id="skills" data-reveal="skills" className={`border-t border-white/10 ${visibleSections.skills ? revealBase : revealHidden}`}>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-400 sm:text-sm">Skills</p>
                  <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Interactive skill clusters</h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Grouped to show how I think across frontend, backend, databases, and cloud engineering instead of listing random keywords.
                </p>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-2">
                {Object.entries(skills).map(([group, items], index) => (
                  <TiltCard
                    key={group}
                    className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-violet-500/20 hover:bg-white/[0.07]"
                  >
                    <div className={`absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl ${index % 2 === 0 ? 'bg-violet-500/10' : 'bg-cyan-500/10'}`} />
                    <div className="relative">
                      <h3 className="text-xl font-semibold capitalize text-white sm:text-2xl">{group}</h3>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-[#111116] px-4 py-2 text-sm text-slate-300 transition hover:scale-105 hover:border-violet-500/30 hover:text-white"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" data-reveal="experience" className={`border-t border-white/10 ${visibleSections.experience ? revealBase : revealHidden}`}>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
              <p className="text-xs uppercase tracking-[0.24em] text-violet-400 sm:text-sm">Experience</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Professional experience</h2>

              <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white sm:text-3xl">{experience.role}</h3>
                    <p className="mt-1 text-violet-400 sm:text-lg">{experience.company}</p>
                    <p className="mt-1 text-slate-400">{experience.location}</p>
                  </div>
                  <p className="w-fit rounded-full border border-white/10 bg-[#111116] px-4 py-2 text-sm text-slate-300">{experience.period}</p>
                </div>

                <div className="mt-8 grid gap-4 xl:grid-cols-2">
                  {experience.highlights.map((item) => (
                    <TiltCard
                      key={item}
                      className="rounded-[24px] border border-white/10 bg-[#111116] p-5 text-sm leading-7 text-slate-300 transition hover:border-violet-500/20 hover:bg-[#14141c] sm:text-base"
                    >
                      {item}
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="projects" data-reveal="projects" className={`border-t border-white/10 ${visibleSections.projects ? revealBase : revealHidden}`}>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-400 sm:text-sm">Projects</p>
                  <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Redesigned project showcase</h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Clean title-first project cards with stronger layout, better readability, and responsive behavior across mobile, tablet, and desktop.
                </p>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-2">
                {projects.map((project) => (
                  <TiltCard
                    key={project.title}
                    onClick={() => setActiveProject(project)}
                    className="group relative cursor-pointer overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-5 text-left transition duration-300 hover:border-violet-500/20 hover:bg-white/[0.07] sm:p-6 lg:p-7"
                  >
                    <ProjectTitlePanel project={project} compact />
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full bg-[#111116] px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/5 sm:text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {project.impact.map((point) => (
                        <div key={point} className="rounded-2xl border border-white/10 bg-[#111116]/80 px-4 py-3 text-sm text-slate-300">
                          {point}
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" data-reveal="contact" className={`border-t border-white/10 ${visibleSections.contact ? revealBase : revealHidden}`}>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
              <TiltCard className="rounded-[34px] border border-violet-500/20 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-7 sm:p-10 lg:p-12">
                <p className="text-xs uppercase tracking-[0.24em] text-violet-400 sm:text-sm">Contact</p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Let’s build something impactful</h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:text-lg">
                  I’m open to software engineering, backend, and full stack opportunities where I can contribute to scalable systems and grow with strong teams.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="mailto:gowthammdb7@gmail.com" className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500">
                    Email Me
                  </a>
                  <a href="https://www.linkedin.com/in/ugowthamss/" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    LinkedIn
                  </a>
                  <a href="https://github.com/GowthamU7" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    GitHub
                  </a>
                </div>
              </TiltCard>
            </div>
          </section>
        </div>
      </div>

      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-white/10 bg-[#0a0a10] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.7)] sm:p-8">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Close
            </button>

            <ProjectTitlePanel project={activeProject} />
            <div className="mt-6 flex flex-wrap gap-2">
              {activeProject.stack.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-[#111116] px-3 py-1.5 text-xs text-slate-300 sm:text-sm">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Open Live Demo
                </a>
              )}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Open GitHub
                </a>
              )}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-violet-400 sm:text-sm">Architecture Flow</p>
                <div className="mt-4 space-y-3">
                  {activeProject.architecture.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/15 text-sm font-semibold text-violet-300 ring-1 ring-violet-500/20">
                        {index + 1}
                      </div>
                      <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:text-base">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-violet-400 sm:text-sm">Project Highlights</p>
                <div className="mt-4 space-y-3">
                  {activeProject.impact.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:text-base">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0a0a10] p-4 shadow-[0_20px_100px_rgba(0,0,0,0.7)]">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              Portfolio command palette
            </div>
            <div className="mt-3 space-y-2">
              {commandItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  onClick={() => setIsCommandOpen(false)}
                  className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:border-violet-500/20 hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
