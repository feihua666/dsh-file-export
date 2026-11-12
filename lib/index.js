/**
 * Host entry point for dsh-file-export.
 *
 * The feature is implemented entirely in the Web client: the browser uses
 * DSH's authenticated workspaceFiles Remote API, so the plugin deliberately
 * registers no HTTP route and owns no server state.
 */
export function apply() {
  // No host-side work; the client entry owns the preview action.
}
