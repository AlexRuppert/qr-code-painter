export function saveSvg(svg: SVGSVGElement, a: HTMLAnchorElement) {
  const blob = new Blob(['<?xml version="1.0"?>' + svg.outerHTML], {
    type: 'image/svg+xml;charset=utf-8',
  })

  a.href = window.URL.createObjectURL(blob)
  a.download = 'qr-code.svg'
  a.click()
}
