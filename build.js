const fs = require('fs')
const path = require('path')
const showdown = require('showdown')

/* --- Site Config (edit me) ------------------------------------ */
const SITE = {
  title: 'Want to know Ron?',
  name: 'Ron', // shown in header + footer
  subtitle: 'Builder • AI • Product',
  email: 'hello@example.com',
  github: 'https://github.com/your-handle',
  linkedin: 'https://www.linkedin.com/in/your-handle/',
}

/* --- Markdown → HTML ------------------------------------------ */
const mdPath = path.resolve(process.cwd(), 'README.md')
const md = fs.readFileSync(mdPath, 'utf8')

const converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  tasklists: true,
  emoji: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  ghCompatibleHeaderId: true,
  underline: true,
  ghMentions: true,
  metadata: true,
})

let contentHTML = converter.makeHtml(md)

/* Ensure headings have IDs (slugify) for TOC + deep links */
const slugify = s => s
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

contentHTML = contentHTML.replace(/<h([1-6])( [^>]*)?>(.*?)<\/h\1>/g, (m, level, attrs = '', inner) => {
  // strip tags inside heading text for slug
  const text = inner.replace(/<[^>]+>/g, '')
  const id = slugify(text)
  const safeAttrs = attrs.includes('id=') ? attrs : `${attrs || ''} id="${id}"`
  return `<h${level}${safeAttrs}>${inner}</h${level}>`
})

/* --- HTML Template -------------------------------------------- */
const html = `
<!DOCTYPE html>
<html lang="en" data-theme="auto">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${SITE.title}</title>
  <meta name="color-scheme" content="light dark" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #0b1020;
      --bg-2: #0f152b;
      --text: #0f1222;
      --muted: #6b7280;
      --card: rgba(255,255,255,0.65);
      --card-border: rgba(17, 24, 39, 0.08);
      --ring: 48 96% 53%;
      --radius: 16px;
      --shadow: 0 10px 40px rgba(2, 6, 23, 0.12);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0b1020;
        --bg-2: #0f152b;
        --text: #e5e7eb;
        --muted: #9aa5b1;
        --card: rgba(13,17,23,0.6);
        --card-border: rgba(255,255,255,0.08);
        --shadow: 0 10px 40px rgba(0,0,0,0.45);
      }
    }

    html, body { height: 100%; }
    body {
      font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji';
      background: radial-gradient(1200px 800px at 10% -10%, rgba(100,108,255,0.25), transparent 60%),
                  radial-gradient(1000px 600px at 90% 10%, rgba(45,212,191,0.25), transparent 60%),
                  linear-gradient(180deg, var(--bg), var(--bg-2));
      color: var(--text);
    }
    a { text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Shell */
    .site-wrap { max-width: 1080px; margin: 48px auto; padding: 0 20px; }

    /* Header/Hero */
    .hero {
      border: 1px solid var(--card-border);
      background: var(--card);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow);
      border-radius: var(--radius);
      padding: 28px 24px;
    }
    .avatar {
      width: 72px; height: 72px; border-radius: 50%;
      display: grid; place-items: center; font-weight: 800; font-size: 28px;
      background: conic-gradient(from 180deg at 50% 50%, #60a5fa, #a78bfa, #34d399, #60a5fa);
      color: white; box-shadow: inset 0 0 0 4px rgba(255,255,255,0.3);
    }

    .chip { display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:999px; border:1px solid var(--card-border); background: rgba(255,255,255,0.6); font-weight:500 }
    @media (prefers-color-scheme: dark){ .chip{ background: rgba(255,255,255,0.06);} }

    /* Layout with TOC */
    .content-grid { display:grid; grid-template-columns: 280px 1fr; gap: 24px; margin-top: 24px; }
    @media (max-width: 992px){ .content-grid { grid-template-columns: 1fr; } }

    .toc {
      position: sticky; top: 24px; height: calc(100vh - 48px);
      border: 1px solid var(--card-border); background: var(--card); backdrop-filter: blur(10px);
      border-radius: var(--radius); padding: 16px; overflow:auto; box-shadow: var(--shadow);
    }
    .toc h6 { font-weight: 700; letter-spacing: .02em; opacity: .8; }
    .toc a { color: inherit; opacity: .8 }
    .toc a.active { opacity: 1; font-weight: 600 }

    .md-card {
      border: 1px solid var(--card-border);
      background: var(--card);
      backdrop-filter: blur(10px);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 28px; overflow: hidden;
    }

    /* Markdown typography */
    .md h1, .md h2, .md h3, .md h4, .md h5, .md h6 { scroll-margin-top: 96px; }
    .md h1 { font-size: 2rem; font-weight:800; margin-top: .5rem }
    .md h2 { font-size: 1.5rem; font-weight:700; margin-top: 2rem }
    .md h3 { font-size: 1.25rem; font-weight:600; margin-top: 1.5rem }
    .md p  { line-height: 1.85; opacity: .95 }
    .md img { max-width: 100%; border-radius: 12px; }
    .md blockquote { border-left: 4px solid rgba(99,102,241,.5); margin: 1rem 0; padding: .75rem 1rem; background: rgba(99,102,241,.08); border-radius: 8px; }

    .md pre { position: relative; }
    .copy-btn {
      position: absolute; top: 10px; right: 10px; border: 1px solid var(--card-border);
      background: rgba(255,255,255,0.75); padding: 6px 10px; border-radius: 8px; font-size: 12px;
    }
    @media (prefers-color-scheme: dark){ .copy-btn{ background: rgba(0,0,0,0.45); color: #e5e7eb } }

    code { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: .95em; }

    /* Footer */
    footer { color: var(--muted); margin: 28px 0 48px; text-align: center; }

    /* Top utilities */
    .util-bar { display:flex; gap:12px; align-items:center; justify-content:flex-end }
    .progress { height: 6px; background: rgba(255,255,255,.35); }
    .progress-bar { background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399); }

    .theme-toggle { border: 1px solid var(--card-border); background: rgba(255,255,255,0.6); border-radius: 10px; padding: 8px 10px; }
    @media (prefers-color-scheme: dark){ .theme-toggle{ background: rgba(255,255,255,0.08) } }
  </style>
</head>
<body>
  <div class="site-wrap">
    <div class="hero d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="avatar">${SITE.name?.[0] || 'R'}</div>
        <div>
          <h1 class="h3 mb-1">${SITE.title}</h1>
          <div class="text-body-secondary">${SITE.subtitle}</div>
          <div class="mt-2 d-flex flex-wrap gap-2">
            <a class="chip" href="${SITE.github}" target="_blank" rel="noopener"><i class="bi bi-github"></i> GitHub</a>
            <a class="chip" href="${SITE.linkedin}" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i> LinkedIn</a>
            <a class="chip" href="mailto:${SITE.email}"><i class="bi bi-envelope"></i> Email</a>
          </div>
        </div>
      </div>
      <div class="util-bar flex-grow-1">
        <button id="themeToggle" class="theme-toggle"><i class="bi bi-brightness-high"></i> Theme</button>
      </div>
      <div class="w-100"></div>
      <div class="w-100 progress rounded-pill" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" id="progressBar" style="width:0%"></div>
      </div>
    </div>

    <div class="content-grid">
      <nav class="toc" id="toc">
        <h6 class="mb-2">On this page</h6>
        <div id="tocItems" class="small"></div>
      </nav>

      <main class="md-card">
        <article id="content" class="md">
          ${contentHTML}
        </article>
      </main>
    </div>

    <footer class="mt-4">&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</footer>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    // Syntax highlight + copy buttons
    document.querySelectorAll('pre code').forEach(block => {
      try { hljs.highlightElement(block) } catch(e) {}
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = 'Copy'
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(block.innerText)
          btn.textContent = 'Copied!'
          setTimeout(() => (btn.textContent = 'Copy'), 1200)
        } catch(e) {}
      })
      block.parentElement.style.position = 'relative'
      block.parentElement.appendChild(btn)
    })

    // Build TOC from h2/h3
    const tocRoot = document.getElementById('tocItems')
    const headings = Array.from(document.querySelectorAll('#content h2, #content h3'))
    const ul = document.createElement('ul'); ul.className = 'list-unstyled'
    headings.forEach(h => {
      const li = document.createElement('li')
      li.style.margin = h.tagName === 'H2' ? '8px 0' : '4px 0 4px 12px'
      const a = document.createElement('a')
      a.href = '#' + (h.id || h.textContent.trim().toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-'))
      a.textContent = h.textContent
      a.addEventListener('click', () => setActive(a))
      li.appendChild(a); ul.appendChild(li)
    })
    tocRoot.appendChild(ul)

    const setActive = (el) => {
      document.querySelectorAll('.toc a').forEach(a => a.classList.remove('active'))
      el.classList.add('active')
    }

    // Scroll spy
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = document.querySelector('.toc a[href="#' + entry.target.id + '"]')
          if (link) setActive(link)
        }
      })
    }, { rootMargin: '0px 0px -65% 0px', threshold: 0 })
    headings.forEach(h => obs.observe(h))

    // Reading progress
    const bar = document.getElementById('progressBar')
    const onScroll = () => {
      const el = document.getElementById('content')
      const rect = el.getBoundingClientRect()
      const total = el.scrollHeight - window.innerHeight
      const scrolled = Math.min(Math.max(window.scrollY - el.offsetTop + 20, 0), total)
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      bar.style.width = pct.toFixed(1) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Theme toggle (light/dark/auto)
    const btn = document.getElementById('themeToggle')
    const setTheme = t => { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); applyTheme(t) }
    const applyTheme = t => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', t === 'dark' || (t === 'auto' && prefersDark))
      btn.innerHTML = t === 'dark' ? '<i class="bi bi-moon-stars"></i> Dark' : t === 'light' ? '<i class="bi bi-brightness-high"></i> Light' : '<i class="bi bi-circle-half"></i> Auto'
    }
    const current = localStorage.getItem('theme') || 'auto'
    setTheme(current)
    btn.addEventListener('click', () => {
      const order = ['light','dark','auto']
      const idx = order.indexOf(localStorage.getItem('theme') || 'auto')
      setTheme(order[(idx + 1) % order.length])
    })

    // External links: noopener
    document.querySelectorAll('a[target="_blank"]').forEach(a => a.rel = 'noopener')
  </script>
</body>
</html>
`

fs.writeFileSync(path.resolve(process.cwd(), 'index.html'), html)
console.log('✅ Generated index.html')
