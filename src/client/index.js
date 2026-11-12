import React from 'react'
import { DownloadAction } from './action.js'
import { en, NS, zh } from './locale.js'
import { injectStyles } from './styles.js'

const h = React.createElement

// These are Cordis services, not just package metadata. In particular,
// remote.workspaceFiles is required before the action can be mounted.
export const inject = ['slots', 'locale', 'remote', 'remote.workspaceFiles']

/** Registers the preview action and owns all client-side effects. */
export function apply(ctx) {
  // DSH's dynamic module loader does not bundle global CSS for this plugin;
  // install the small page-scoped stylesheet when the client module activates.
  ctx.effect(() => injectStyles(NS), 'dsh-file-export: styles')

  // Register UI copy separately from plugin-manager metadata so changing the
  // DSH interface language updates button labels without rebuilding the bundle.
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-file-export: dictionaries')

  // The document-preview package owns file loading and supplies absolutePath;
  // this plugin contributes only one action to its toolbar.
  ctx.slots.inject('sidebar.right.tab.document.actions', () => ctx.slots.register({
    name: 'sidebar.right.tab.document.actions',
    id: 'dsh-file-export',
    order: 40,
    locale: NS,
  }, (props) => h(DownloadAction, {
    ...props,
    t: ctx.locale.bind(NS),
    workspaceFiles: ctx.remote.workspaceFiles,
  })))
}
