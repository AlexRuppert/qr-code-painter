import {
  cloneMatrix,
  iterateOverMatrix,
  MatrixIterationDirection,
  mergeMatrices,
  range,
} from '../utilities'

function getLineGroupScore(matrix: boolean[][]) {
  let score = 0
  let currentColor = false
  let currentRun = 0

  const scoreLineGroupCondition = () => {
    score += currentRun >= 5 ? 3 + Math.max(0, currentRun - 5) : 0
    currentRun = 0
  }

  Object.values(MatrixIterationDirection).forEach((dir) => {
    iterateOverMatrix(
      matrix,
      (value) => {
        if (value !== currentColor) {
          scoreLineGroupCondition()
          currentColor = value
        }
        currentRun++
      },
      scoreLineGroupCondition,
      dir as MatrixIterationDirection,
    )
  })
  return score
}

function getSquareScore(matrix: boolean[][]) {
  let score = 0

  iterateOverMatrix(matrix, (_, x, y) => {
    if (x < matrix.length - 1 && y < matrix.length - 1) {
      const squareBitMask = range(0, 4).reduce(
        //get current, right, bottom and bottom-right module and merge them to a bitmask
        (acc, dirBitMask, i) =>
          acc | (+matrix[y + (dirBitMask >> 1)][x + (dirBitMask & 0b01)] << i),
        0,
      )
      const isSquare = squareBitMask === 0 || squareBitMask === 15
      score += isSquare ? 3 : 0
    }
  })
  return score
}

function getFinderConfusionScore(matrix: boolean[][]) {
  const [d, w] = [true, false]
  const template = [d, w, d, d, d, w, d, w, w, w, w]
  const patterns = [
    { template, current: 0 },
    { template: template.slice().reverse(), current: 0 },
  ]

  let score = 0
  const evaluateFinderConfusionCondition = (value: boolean) => {
    patterns.forEach((pattern) => {
      pattern.current +=
        value === pattern.template[pattern.current] ? 1 : -pattern.current
      if (pattern.current >= pattern.template.length) {
        score += 40
        pattern.current = 0
      }
    })
  }

  Object.values(MatrixIterationDirection).forEach((dir) => {
    iterateOverMatrix(
      matrix,
      (value) => evaluateFinderConfusionCondition(value),
      () => patterns.forEach((pattern) => (pattern.current = 0)),
      dir as MatrixIterationDirection,
    )
  })
  return score
}

function getColorImbalanceScore(matrix: boolean[][]) {
  const totalCount = matrix.length * matrix.length
  let darkCount = 0
  iterateOverMatrix(matrix, (value) => (darkCount += value ? 1 : 0))

  const percentage = +((darkCount / totalCount) * 100).toFixed(0)
  const lower = percentage - (percentage & 5)
  const higher = lower + 5
  let score =
    Math.min(...[lower, higher].map((el) => Math.abs(el - 50) / 5)) * 10

  return score
}

function evaluateMasking(matrix: boolean[][]) {
  return [
    getLineGroupScore,
    getSquareScore,
    getFinderConfusionScore,
    getColorImbalanceScore,
  ]
    .map((fn) => fn(matrix))
    .reduce((acc, val) => acc + val, 0)
}

export function applyMasking(
  functionalMatrix: boolean[][],
  dataMatrix: boolean[][],
) {
  const maskMatrix = (
    matrix: boolean[][],
    condition: { (x: any, y: any): boolean; (arg0: number, arg1: number): any },
  ) => {
    const copy = cloneMatrix(matrix)
    iterateOverMatrix(copy, (value, x, y) => {
      if (condition(x, y)) copy[y][x] = !value
    })
    return copy
  }

  const maskingMethods: Array<(x: number, y: number) => boolean> = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x, y) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ]

  return maskingMethods
    .map((method) =>
      mergeMatrices(functionalMatrix, maskMatrix(dataMatrix, method)),
    )
    .reduce(
      //find the matrix with lowest score
      (acc, matrix, mask) => {
        const score = evaluateMasking(matrix)
        return score < acc.score ? { score, mask, matrix } : acc
      },
      { score: Number.POSITIVE_INFINITY, mask: 0, matrix: [] as boolean[][] },
    )
}
