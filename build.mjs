import { build } from 'esbuild'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile('package.json', 'utf8'))

// DSH expects the browser artifact to register a lazy module through its
// ModuleLoader. esbuild produces the CommonJS body inside this wrapper.
const clientBanner = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports`
const clientFooter = `
    return module.exports
  }
})`

// lib is committed because Git installs consume the package entrypoints
// directly; rebuilding first prevents stale files from being published.
await rm('lib', { recursive: true, force: true })
await mkdir('lib', { recursive: true })

// The host entry has no runtime logic, but DSH still needs a real package
// entry for the bundle layer. Copy it without a second compilation pipeline.
const hostSource = await readFile('src/host/index.js', 'utf8')
await writeFile('lib/index.js', hostSource)

// Keep React external: DSH's Web shell supplies the shared React module, while
// the plugin bundle contains only its own feature code and helpers.
await build({
  entryPoints: ['src/client/index.js'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  external: ['react'],
  outfile: 'lib/client.js',
  banner: { js: clientBanner },
  footer: { js: clientFooter },
})
