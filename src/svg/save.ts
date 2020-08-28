export function saveSvg(svg: SVGSVGElement, a: HTMLAnchorElement) {
  const fileName = `qr-code.svg`
  let blob = new Blob([svg.outerHTML], {
    type: 'image/svg+xml;charset=utf-8',
  })
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}
