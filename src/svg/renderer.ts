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

  return rect
}
const rectTemplate = createRectTemplate()

function createRect(container: DocumentFragment, position: Position) {
  const rect = rectTemplate.cloneNode(false) as SVGElement
  rect.setAttribute('x', position.x.toString())
  rect.setAttribute('y', position.y.toString())

  container.appendChild(rect)
}

export function render(canvas: SVGSVGElement, matrix: boolean[][]) {
  canvas.innerHTML = ''
  canvas.setAttribute(
    'viewBox',
    `0 0 ${matrix[0].length + 8 || 10} ${matrix.length + 8}`,
  )
  const g = createElement('g')
  g.setAttribute('fill', '#000')
  g.setAttribute('shape-rendering', 'crispEdges')

  const fragment = document.createDocumentFragment()
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === true) {
        createRect(fragment, { x: x + 4, y: y + 4 })
      }
    }
  }
  g.appendChild(fragment)
  canvas.appendChild(g)
}

export function clear(canvas: SVGSVGElement) {
  canvas.innerHTML = ''
}
