export function chunkString(content: string, length: number): string[] {
  const result: string[] = []
  let i = 0
  while (i * length < content.length)
    result.push(content.substr(i++ * length, length))
  return result
}

export function get0s(count: number) {
  return [...Array(count)].map((e) => '0').join('')
}

export function pad0(content: string, length: number) {
  const diff = length - content.length
  return get0s(diff) + content
}

export function numToBits(content: number, length: number) {
  return pad0(content.toString(2), length)
}

export function concatTypedArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

export function range(from: number, to: number): number[] {
  return Array(to - from)
    .fill(from)
    .map((x, index) => x + index)
}
export function createMatrix(dimensions: number): boolean[][] {
  return [...new Array(dimensions)].map(() =>
    [...new Array(dimensions)].fill(null),
  )
}
export function cloneMatrix(matrix: boolean[][]) {
  return matrix.slice().map((m) => m.slice())
}
export function mergeMatrices(
  matrix1: boolean[][],
  matrix2: boolean[][],
): boolean[][] {
  let result = cloneMatrix(matrix1)
  iterateOverMatrix(matrix1, (val, x, y) => {
    if (val === null) {
      result[y][x] = matrix2[y][x]
    }
  })
  return result
}

export enum MatrixIterationDirection {
  Horizontal,
  Vertical,
}
export function iterateOverMatrix(
  matrix: boolean[][],
  fn: (value: boolean, x: number, y: number, matrix: boolean[][]) => void,
  fnSecondary: (index: number, matrix: boolean[][]) => void = () => {},
  direction = MatrixIterationDirection.Horizontal,
) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (direction === MatrixIterationDirection.Horizontal)
        fn(matrix[y][x], x, y, matrix)
      else fn(matrix[x][y], y, x, matrix)
    }
    fnSecondary(y, matrix)
  }
}

export function debounce(fn: () => void, wait: number) {
  let timer: number | undefined
  return function () {
    const later = () => {
      timer = undefined
      fn()
    }
    clearTimeout(timer)
    timer = setTimeout(later, wait)
  }
}
