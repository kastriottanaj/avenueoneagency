import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const container = document.getElementById('root')!

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Routes are prerendered to static HTML at build time, so the visitor (and
// every crawler) sees real content before any JavaScript runs.
//
// Only markup React produced is safe to hydrate. Blog posts are rendered by
// Django per request as plain semantic HTML for crawlers — that markup will
// not match the React tree, so it is replaced rather than hydrated.
if (container.dataset.render === 'hydrate') {
  hydrateRoot(container, tree)
} else {
  container.innerHTML = ''
  createRoot(container).render(tree)
}
