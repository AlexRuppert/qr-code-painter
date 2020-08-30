export function saveSvg(svg: SVGSVGElement, a: HTMLAnchorElement) {
  const fileName = `qr-code.svg`
  let blob = new Blob(['<?xml version="1.0"?>' + svg.outerHTML], {
    type: 'image/svg+xml;charset=utf-8',
  })
  const url = window.URL.createObjectURL(blob)

  a.href = url
  a.download = fileName
  a.click()
}
