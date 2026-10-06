import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'

/**
 * Build-time rendering entry point.
 *
 * The site is a client-rendered SPA, which means the HTML response carried an
 * empty <div id="root">. Google executes JavaScript, but GPTBot, ClaudeBot,
 * PerplexityBot and most social unfurlers do not — so to every AI engine the
 * site had no content at all. For an agency that sells AI Engine Optimization
 * that is the whole ballgame.
 *
 * prerender.mjs calls this once per route at build time and writes the result
 * into the served HTML; the browser then hydrates it.
 */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
