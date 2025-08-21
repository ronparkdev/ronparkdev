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
