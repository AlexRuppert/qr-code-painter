export function render(canvas: SVGSVGElement, matrix: boolean[][]) {
  const viewBox = matrix.length + 10
  canvas.setAttribute('viewBox', `0 0 ${viewBox} ${viewBox}`)

  let d = ''
  for (let y = 0; y < matrix.length; y++) {
    let first = true
    let lastX = 0
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x]) {
        let len = 0
        while (++len + x < matrix.length && matrix[y][len + x]);

        d +=
          (first && !(first = false)
            ? `M${x + 5} ${y + 5}`
            : `m${x - lastX} 0`) + `h${len}`
        lastX = (x += len - 1) + 1
      }
    }
  }
  canvas.innerHTML = `<path d="${d}"/>`
}

export function clear(canvas: SVGSVGElement) {
  canvas.innerHTML = ''
}
