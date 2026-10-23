import { useEffect, useRef, useState } from 'react'

const EMAIL = 'praisemandik8@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/praise-mandik-963b87355'
const GITHUB = 'https://github.com/praisemandik8-web'

const navItems = ['about', 'experience', 'projects', 'skills', 'contact']

const about = [
  'I am a software engineer with a B.Sc. in Computer Science from the University of Jos. My main focus is backend development with Java and Spring Boot, and I also build with C#/.NET, Python/FastAPI and React.',
  'Lately I have been getting into DevOps: containerising apps with Docker and automating builds with GitHub Actions and Azure DevOps. I am open to remote roles.',
]

const experience = [
  {
    role: 'Software Engineering Trainee',
    org: 'Semicolon Africa',
    period: 'Feb 2026 - present',
    note: 'Backend engineering training with Java and Spring Boot. Built Wishly, a birthday reminder API.',
  },
  {
    role: 'Graduate Trainee',
    org: 'Avetium Technologies',
    period: 'Feb 2026 - present',
    note: '',
  },
]

const projects = [
  {
    title: 'Student Management System',
    status: 'in development',
    kind: 'dev',
    description:
      'Full-stack app with a C# ASP.NET Core Web API and a React client, secured with JWT authentication. Docker and GitHub Actions set up for DevOps.',
    tags: ['C#', 'ASP.NET Core', 'React', 'EF Core', 'JWT', 'Docker', 'GitHub Actions'],
    links: [
      { label: 'api', href: 'https://github.com/praisemandik8-web/StudentManagement.Api' },
      { label: 'client', href: 'https://github.com/praisemandik8-web/StudentManagement.Client' },
    ],
  },
  {
    title: 'Event Ticketing System',
    status: 'live demo',
    kind: 'live',
    description:
      'Team project. I built the Ticket and TicketType models, services and repositories for the FastAPI backend.',
    tags: ['FastAPI', 'Docker', 'Vercel', 'Team project'],
    links: [
      { label: 'demo', href: 'https://eventpadi-steel.vercel.app' },
      { label: 'api', href: 'https://github.com/BIGDUKE004/Event-Ticketing-System' },
      { label: 'client', href: 'https://github.com/BIGDUKE004/Event-Ticketing-System-Frontend' },
    ],
  },
  {
    title: 'Wishly',
    status: 'in development',
    kind: 'dev',
    description:
      'Birthday reminder API: contact CRUD, upcoming birthdays and scheduled daily reminders, with centralised exception handling.',
    tags: ['Java', 'Spring Boot', 'Spring Data JPA', 'H2'],
    links: [{ label: 'source', href: 'https://github.com/praisemandik8-web/wishly' }],
  },
]

const skills = [
  { label: 'backend', items: ['Java', 'Spring Boot', 'C#', '.NET', 'Python', 'FastAPI', 'Go'] },
  { label: 'frontend', items: ['React', 'Redux', 'Vite', 'JavaScript', 'Tailwind CSS'] },
  { label: 'devops', items: ['Docker', 'GitHub Actions', 'Azure DevOps'] },
]

const COMMANDS = {
  help: () => [
    'available commands:',
    '  about      who I am',
    '  skills     what I work with',
    '  projects   things I have built',
    '  contact    how to reach me',
    '  clear      clear the screen',
  ],
  about: () => [
    'praise mandik, software engineer',
    'backend: java + spring boot, also c#/.net and python',
    'growing into devops: docker, github actions',
    'open to remote roles',
  ],
  skills: () => skills.map((s) => `${s.label.padEnd(10)}${s.items.join(', ')}`),
  projects: () => projects.map((p, i) => `${i + 1}. ${p.title} [${p.status}]`),
  contact: () => [`email      ${EMAIL}`, `linkedin   ${LINKEDIN}`, `github     ${GITHUB}`],
}

function useTyping(text, speed = 70, delay = 400) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text)
      return undefined
    }
    let i = 0
    let timer
    const tick = () => {
      i += 1
      setOut(text.slice(0, i))
      if (i < text.length) timer = setTimeout(tick, speed)
    }
    timer = setTimeout(tick, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])
  return out
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setShown(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`}>
      {children}
    </div>
  )
}

function Terminal() {
  const [history, setHistory] = useState([
    { cmd: 'whoami', out: ['praise mandik / software engineer'] },
    { cmd: 'help', out: COMMANDS.help() },
  ])
  const [value, setValue] = useState('')
  const bodyRef = useRef(null)

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    if (cmd === 'clear') {
      setHistory([])
    } else {
      const known = Object.prototype.hasOwnProperty.call(COMMANDS, cmd)
      const out = known ? COMMANDS[cmd]() : [`command not found: ${cmd}. try 'help'`]
      setHistory((h) => [...h, { cmd, out }])
    }
    setValue('')
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }, 0)
  }

  return (
    <div className="terminal" role="region" aria-label="Interactive terminal">
      <div className="t-bar" aria-hidden="true">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="t-title mono">praise@portfolio ~ </span>
      </div>
      <div className="t-body mono" ref={bodyRef} aria-live="polite">
        {history.map((h, i) => (
          <div key={i} className="t-block">
            <div>
              <span className="accent">$</span> {h.cmd}
            </div>
            {h.out.map((line, j) => (
              <div key={j} className="t-out">
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
      <form
        className="t-input mono"
        onSubmit={(e) => {
          e.preventDefault()
          run(value)
        }}
      >
        <span className="accent" aria-hidden="true">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Type a command"
          placeholder="type a command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
      <div className="t-chips mono">
        {['help', 'about', 'skills', 'projects', 'contact'].map((c) => (
          <button type="button" key={c} onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const typed = useTyping('software engineer')

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner mono">
          <a href="#top" className="brand">praise.mandik</a>
          <nav className="links" aria-label="Sections">
            {navItems.map((n) => (
              <a key={n} href={`#${n}`}>{n}</a>
            ))}
          </nav>
        </div>
      </header>

      <main className="page" id="top">
        <section className="hero">
          <div className="hero-text">
            <div className="status mono">
              <span className="pulse" aria-hidden="true" /> open to remote roles
            </div>
            <div className="tagline accent mono">
              <span className="sr-only">software engineer</span>
              <span aria-hidden="true">
                &gt; {typed}
                <span className="cursor">_</span>
              </span>
            </div>
            <div className="identity">
              <img src="/praise-headshot.jpg" alt="Praise Mandik" className="avatar" />
              <h1>Praise Mandik</h1>
            </div>
            <p className="intro">
              Java, Spring Boot and C#/.NET developer building APIs and services, with a growing focus on DevOps.
            </p>
            <div className="cta mono">
              <a className="btn primary" href="#projects">view projects</a>
              <a className="btn" href={`mailto:${EMAIL}`}>get in touch</a>
            </div>
          </div>
          <Terminal />
        </section>

        <section id="about" className="section">
          <Reveal>
            <h2 className="section-title mono"><span className="accent">01</span> about</h2>
            <div className="about">
              {about.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="experience" className="section">
          <Reveal>
            <h2 className="section-title mono"><span className="accent">02</span> experience</h2>
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.org}>
                  <div className="tl-head">
                    <strong>{e.role}</strong>
                    <span className="muted"> / {e.org}</span>
                  </div>
                  <div className="tl-period mono muted">{e.period}</div>
                  {e.note && <p className="tl-note">{e.note}</p>}
                </li>
              ))}
            </ol>
            <div className="edu">
              <strong>B.Sc. Computer Science</strong>
              <span className="muted"> / University of Jos</span>
            </div>
          </Reveal>
        </section>

        <section id="projects" className="section">
          <Reveal>
            <h2 className="section-title mono"><span className="accent">03</span> projects</h2>
          </Reveal>
          <div className="cards">
            {projects.map((p, i) => (
              <Reveal key={p.title} className="card-wrap">
                <article className="card">
                  <div className="card-head">
                    <span className="num mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`badge mono ${p.kind}`}>{p.status}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="tags mono">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="card-links mono">
                    {p.links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                        {l.label} &#8599;
                      </a>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <Reveal>
            <h2 className="section-title mono"><span className="accent">04</span> skills</h2>
            <div className="skill-groups">
              {skills.map((s) => (
                <div key={s.label} className="skill-group">
                  <div className="skill-label accent mono">{s.label}</div>
                  <ul className="tags mono">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="contact" className="section contact">
          <Reveal>
            <h2 className="section-title mono"><span className="accent">05</span> contact</h2>
            <p className="intro">Looking for a backend or full-stack engineer? Let us talk.</p>
            <div className="cta mono">
              <a className="btn primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">linkedin</a>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">github</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer mono muted">
        &copy; {new Date().getFullYear()} Praise Mandik
      </footer>
    </>
  )
}
