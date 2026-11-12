import React from 'react'
import { downloadFile } from './download.js'
import { DownloadGlyph, SpinnerGlyph } from './glyphs.js'

const h = React.createElement

/**
 * Download action mounted in the document preview's action area.
 *
 * The preview supplies the Session id and resolved absolute path. Keeping
 * those values at the slot boundary means this component never constructs a
 * gateway URL or exposes a second unauthenticated download route.
 */
export function DownloadAction(props) {
  const { absolutePath, sessionId, t, workspaceFiles } = props
  const [downloading, setDownloading] = React.useState(false)
  if (typeof absolutePath !== 'string' || absolutePath === '') return null

  const name = absolutePath.split(/[\\/]/).pop() || absolutePath
  // Disable repeated clicks while the Remote read and browser handoff finish.
  const download = async () => {
    setDownloading(true)
    try {
      await downloadFile(workspaceFiles, sessionId, absolutePath, name)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      window.alert(t('view.downloadError', { message }))
    } finally {
      setDownloading(false)
    }
  }

  const label = downloading ? t('view.downloading') : t('view.downloadNamed', { name })
  return h('button', {
    type: 'button',
    className: 'dfd-docbtn',
    title: label,
    'aria-label': label,
    'aria-busy': downloading,
    disabled: downloading,
    onClick: download,
  }, downloading ? h(SpinnerGlyph) : h(DownloadGlyph))
}
