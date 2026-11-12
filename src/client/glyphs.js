import React from 'react'

const h = React.createElement

/** Small toolbar icon shown when the file is ready to download. */
export function DownloadGlyph() {
  return h('svg', {
    width: 13,
    height: 13,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }, h('path', { d: 'M8 2.5v7.5' }), h('path', { d: 'm5 7.5 3 3 3-3' }), h('path', { d: 'M3.5 12v1.5h9V12' }))
}

/** Animated icon shown while the binary Remote request is in progress. */
export function SpinnerGlyph() {
  return h('svg', {
    className: 'dfd-spinner',
    width: 15,
    height: 15,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    'aria-hidden': true,
  }, h('path', { d: 'M13 8a5 5 0 1 1-2.1-4.08' }))
}
