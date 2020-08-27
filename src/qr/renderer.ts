interface Position {
  x: number
  y: number
}
function createElement(tag: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

const debug = true
function createRectTemplate() {
  let rect = createElement('rect')

  rect.setAttribute('width', '1')
  rect.setAttribute('height', '1')
  rect.setAttribute('shape-rendering', 'crispEdges')

  return rect
}
const rectTemplate = createRectTemplate()

function createRect(container: SVGElement, position: Position, color: string) {
  const rect = rectTemplate.cloneNode(false) as SVGElement
  rect.setAttribute('x', position.x.toString())
  rect.setAttribute('y', position.y.toString())
  rect.setAttribute('fill', color)
  container.appendChild(rect)
}

export function render(canvas: HTMLElement, matrix: boolean[][]) {
  canvas.innerHTML = ''
  canvas.setAttribute(
    'viewBox',
    `0 0 ${matrix[0].length || 10} ${matrix.length}`,
  )
  const g = createElement('g')

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== null) {
        createRect(g, { x, y }, matrix[y][x] ? '#000' : '#fff')
      }
    }
  }
  canvas.appendChild(g)
}
