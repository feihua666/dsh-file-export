/**
 * Maps common document extensions to a browser Blob type.
 *
 * The MIME type only affects the browser's download metadata; the bytes are
 * always supplied by DSH's authenticated Workspace Files service.
 */
function contentType(name) {
  const extension = String(name ?? '').split('.').pop().toLowerCase()
  const types = {
    pdf: 'application/pdf',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ppt: 'application/vnd.ms-powerpoint',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    txt: 'text/plain',
    md: 'text/markdown',
    csv: 'text/csv',
  }
  return types[extension] ?? 'application/octet-stream'
}

/** Describes a rejected payload so a changed Remote shape stays diagnosable. */
function describe(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return `array(length ${value.length})`
  if (typeof value !== 'object') return typeof value
  const keys = Object.keys(value)
  return keys.length === 0 ? 'object(no keys)' : `object(keys: ${keys.slice(0, 8).join(', ')})`
}

/**
 * Normalizes the Remote API binary payload without losing byte offsets.
 *
 * A typed-array view can reference a larger backing buffer, so byteOffset and
 * byteLength must be preserved instead of passing the backing buffer directly
 * to Blob. The extra shapes keep the plugin compatible with older DSH builds.
 */
function toBytes(data) {
  if (data instanceof Uint8Array) return new Uint8Array(data)
  if (data instanceof ArrayBuffer) return new Uint8Array(data)
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice()
  }
  if (data !== null && typeof data === 'object' && 'data' in data) return toBytes(data.data)
  if (Array.isArray(data)) return Uint8Array.from(data)
  throw new Error(`workspaceFiles.readBytes returned no binary data (${describe(data)})`)
}

/**
 * Unwraps DSH's RemoteResult envelope and supports older direct responses.
 *
 * Newer Remote calls return `{ ok, value }`; older builds returned the value
 * itself or wrapped it in `result`. Errors are converted to one user-facing
 * exception here so the button component does not know wire-level details.
 */
function unwrapResult(response) {
  if (response === null || typeof response !== 'object') return response
  if (typeof response.ok === 'boolean') {
    if (!response.ok) {
      const error = response.error
      const message = typeof error?.message === 'string' ? error.message : ''
      const code = typeof error?.code === 'string' ? error.code : ''
      throw new Error(message || code || 'workspaceFiles.readBytes failed')
    }
    return response.value
  }
  if ('result' in response) return response.result
  return response
}

/**
 * Reads one previewed file and starts a browser download.
 *
 * `readBytes` returns complete binary content, not a navigable URL. The Blob
 * URL therefore exists only in the browser and is released after the download
 * handoff, which avoids truncating Office files while keeping memory bounded.
 */
export async function downloadFile(workspaceFiles, sessionId, absolutePath, name) {
  // The path comes from the preview's authenticated Session resource; do not
  // reconstruct it from the public gateway address.
  const response = await workspaceFiles.readBytes(sessionId, absolutePath, {})
  const file = unwrapResult(response)
  const payload = file?.data === undefined ? file : file.data
  const data = toBytes(payload)
  if (data.byteLength === 0 && Number(file?.bytes) > 0) {
    throw new Error('workspaceFiles.readBytes returned an empty file')
  }
  if (file?.eof === false || Number(file?.bytes) > data.byteLength) {
    throw new Error('workspaceFiles.readBytes returned an incomplete file')
  }

  // Copy the validated bytes into a browser-owned object for the download.
  const blob = new Blob([data], { type: contentType(name) })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name || 'download'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  // Keep the object URL alive while the browser starts the download. Releasing
  // it immediately can leave a downloaded Office file empty or truncated.
  window.setTimeout(() => URL.revokeObjectURL(url), 30000)
}
