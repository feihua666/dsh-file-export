// Keep the action visually consistent with DSH's document-preview toolbar.
// The component only contributes a class name; the stylesheet is installed
// once when the plugin is activated.
export const CSS = [
  '.dfd-docbtn{flex:none;align-self:center;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;box-sizing:border-box;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
  '.dfd-docbtn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
  '.dfd-docbtn:focus-visible{background:var(--dsw-alias-bg-layer-2);outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
  '.dfd-docbtn[disabled]{opacity:.5;cursor:default}',
  '.dfd-spinner{transform-origin:center}',
  '.dfd-docbtn[disabled] .dfd-spinner{animation:dfd-spin .8s linear infinite}',
  '@keyframes dfd-spin{to{transform:rotate(360deg)}}',
].join('\n')

/** Appends the plugin stylesheet to the document once for the current page. */
export function injectStyles(namespace) {
  if (typeof document === 'undefined') return
  const selector = `style[data-plugin-css=${JSON.stringify(namespace)}]`
  if (document.querySelector(selector) !== null) return
  const tag = document.createElement('style')
  tag.dataset.plugin = namespace
  tag.dataset.pluginCss = namespace
  tag.textContent = CSS
  document.head.appendChild(tag)
}
