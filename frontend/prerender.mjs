import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, 'dist')
const outDir = join(dist, 'prerendered')

const { render } = await import(resolve(here, 'dist-server/entry-server.js'))

const { verticals } = JSON.parse(
  readFileSync(resolve(here, 'src/data/verticals.json'), 'utf8'),
)
const { pages: commercialPages } = JSON.parse(
  readFileSync(resolve(here, 'src/data/commercialPages.json'), 'utf8'),
)

// Every route Django serves the app for. Blog posts are excluded: they come
// from the database, so Django renders those per request.
const ROUTES = [
  '/',
  '/about/',
  '/services/',
  '/industries/',
  '/testimonials/',
  '/contact/',
  '/blog/',
  '/imprint/',
  '/privacy/',
  '/404/',
  ...verticals.map((v) => `/${v.slug}/`),
  ...commercialPages.map((page) => `/${page.slug}/`),
]

const template = readFileSync(join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find the empty root div in dist/index.html')
}

mkdirSync(outDir, { recursive: true })

let total = 0
for (const route of ROUTES) {
  const html = render(route)
  const page = template.replace(
    '<div id="root"></div>',
    `<div id="root" data-render="hydrate">${html}</div>`,
  )
  const name = route === '/' ? 'index' : route.replace(/^\/|\/$/g, '').replace(/\//g, '__')
  const file = join(outDir, `${name}.html`)
  writeFileSync(file, page)
  total += Buffer.byteLength(page)
  console.log(`  ${route.padEnd(18)} -> ${name}.html  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB of content`)
}
console.log(`prerendered ${ROUTES.length} routes, ${(total / 1024).toFixed(0)} KB total`)
