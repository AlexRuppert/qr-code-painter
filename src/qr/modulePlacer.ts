import { QrConfig } from './selectConfig'
import table from './definitions'
import { numToBits, pad0, range } from './utilities'
import { divPoly } from './galoisField'
function getDimensions(config: QrConfig) {
  return (config.version - 1) * 4 + 21
}

function addFinderPatterns(dimensions: number, matrix: boolean[][]) {
  const drawPattern = (x, y) => {
    for (let xx = 0; xx < 7; xx++) {
      for (let yy = 0; yy < 7; yy++) {
        matrix[y + yy][x + xx] = !(
          (xx % 4 === 1 && yy >= 1 && yy < 6) ||
          (yy % 4 === 1 && xx >= 1 && xx < 6)
        )
      }
    }

    for (let xx = -1; xx <= 7; xx++) {
      matrix[y + (y === 0 ? 7 : -1)][x + xx] = false
    }
    for (let yy = 0; yy < 7; yy++) {
      matrix[y + yy][x + (x === 0 ? 7 : -1)] = false
    }
  }
  drawPattern(0, 0)
  drawPattern(0, dimensions - 7)
  drawPattern(dimensions - 7, 0)
  return matrix
}

function addTimingPatterns(dimensions: number, matrix: boolean[][]) {
  for (let x = 7; x < dimensions - 7; x++) {
    matrix[6][x] = x % 2 === 0
  }
  for (let y = 7; y < dimensions - 7; y++) {
    matrix[y][6] = y % 2 === 0
  }
  return matrix
}

function addDarkModule(dimensions: number, matrix: boolean[][]) {
  matrix[dimensions - 8][8] = true
  return matrix
}
function addReservedAreas(config: QrConfig, matrix: boolean[][]) {
  const dimensions = getDimensions(config)
  const reserve = (x, y) => {
    matrix[y][x] = matrix[y][x] === null ? false : matrix[y][x]
  }
  for (let i = 0; i < 9; i++) {
    reserve(i, 8)
    reserve(8, i)
  }
  for (let i = dimensions - 8; i < dimensions; i++) {
    reserve(i, 8)
    reserve(8, i)
  }

  //for version >=7 codes add additional areas
  if (config.version >= 7) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        reserve(dimensions - 11 + i, j)
        reserve(j, dimensions - 11 + i)
      }
    }
  }

  return matrix
}
function addAlignmentPatterns(locations: number[], matrix: boolean[][]) {
  const drawPattern = (x, y) => {
    for (let xx = 0; xx < 5; xx++) {
      for (let yy = 0; yy < 5; yy++) {
        matrix[y + yy - 2][x + xx - 2] = !(
          (xx % 2 === 1 && yy >= 1 && yy < 4) ||
          (yy % 2 === 1 && xx >= 1 && xx < 4)
        )
      }
    }
  }

  const maxLocation = Math.max(...locations)
  const minLocation = Math.min(...locations)
  const validLocationPairs = locations
    .map((x, i, array) => array.map((y) => [x, y]))
    .flat()
    .filter(
      ([x, y]) =>
        !(
          (x === minLocation && (y === minLocation || y === maxLocation)) ||
          (y === minLocation && (x === minLocation || x === maxLocation))
        ),
    )

  validLocationPairs.forEach(([x, y]) => drawPattern(x, y))

  return matrix
}
function applyData(
  dimensions: number,
  functionalMatrix: boolean[][],
  data: string,
) {
  let dataMatrix = createMatrix(dimensions)
  let x = dimensions - 1
  let dx = 0
  let y = dimensions - 1
  let d = 0
  let direction: 'up' | 'down' = 'up'

  const isNextToVerticalTimingPattern = (x) => {
    return x >= 6 && x <= 7
  }
  while (d < data.length) {
    const bit = data[d] === '1'

    if (functionalMatrix[y][x - dx] === null) {
      dataMatrix[y][x - dx] = bit
      d++
    }

    if (dx === 1) {
      dx = 0
      if (direction === 'up') {
        y--
        if (y < 0) {
          y = 0
          direction = 'down'
          x -= 2
        }
      } else {
        y++
        if (y >= dimensions) {
          y = dimensions - 1
          direction = 'up'
          x -= 2
        }
      }
    } else dx = 1
    if (isNextToVerticalTimingPattern(x)) {
      x = 5
    }
  }
  return dataMatrix
}

function evaluateMasking(matrix: boolean[][]) {
  const dimensions = matrix.length
  let sum = 0

  const getLineGroupScore = () => {
    let score = 0
    let currentColor = false
    let currentRun = 0
    const scoreLineGroupCondition = () => {
      if (currentRun >= 5) {
        score += 3 + Math.max(0, currentRun - 5)
      }
    }
    //horizontal
    for (let y = 0; y < dimensions; y++) {
      currentRun = 0
      for (let x = 0; x < dimensions; x++) {
        if (matrix[y][x] === currentColor) {
          currentRun++
        } else {
          scoreLineGroupCondition()
          currentColor = matrix[y][x]
          currentRun = 1
        }
      }
      scoreLineGroupCondition()
    }
    //vertical
    for (let x = 0; x < dimensions; x++) {
      currentRun = 0
      for (let y = 0; y < dimensions; y++) {
        if (matrix[y][x] === currentColor) {
          currentRun++
        } else {
          scoreLineGroupCondition()
          currentColor = matrix[y][x]
          currentRun = 1
        }
      }
      scoreLineGroupCondition()
    }
    return score
  }

  const getSquareScore = () => {
    let score = 0

    for (let y = 0; y < dimensions - 1; y++) {
      for (let x = 0; x < dimensions - 1; x++) {
        const potentialSquare = [
          matrix[y][x],
          matrix[y][x + 1],
          matrix[y + 1][x],
          matrix[y + 1][x + 1],
        ]
        const isSquare =
          potentialSquare.every((m) => m === false) ||
          potentialSquare.every((m) => m === true)

        score += isSquare ? 3 : 0
      }
    }
    return score
  }
  const getFinderConfusionScore = () => {
    let score = 0

    const d = true
    const w = false
    const template = [d, w, d, d, d, w, d, w, w, w, w]
    const patterns = [
      { template, current: 0 },
      { template: template.slice().reverse(), current: 0 },
    ]

    const evaluateFinderConfusionCondition = (x, y) => {
      patterns.forEach((pattern) => {
        if (matrix[y][x] === pattern.template[pattern.current]) {
          pattern.current++
          if (pattern.current >= pattern.template.length) {
            score += 40
            pattern.current = 0
          }
        } else {
          pattern.current = 0
        }
      })
    }
    //horizontal
    for (let y = 0; y < dimensions; y++) {
      for (let x = 0; x < dimensions; x++) {
        evaluateFinderConfusionCondition(x, y)
      }
      patterns.forEach((pattern) => {
        pattern.current = 0
      })
    }

    //vertical
    for (let x = 0; x < dimensions; x++) {
      for (let y = 0; y < dimensions; y++) {
        evaluateFinderConfusionCondition(x, y)
      }
      patterns.forEach((pattern) => {
        pattern.current = 0
      })
    }

    return score
  }
  const getColorImbalanceScore = () => {
    let score = 0
    const totalCount = dimensions * dimensions
    let darkCount = 0
    for (let y = 0; y < dimensions; y++) {
      for (let x = 0; x < dimensions; x++) {
        darkCount += matrix[y][x] ? 1 : 0
      }
    }

    const percentage = +((darkCount / totalCount) * 100).toFixed(0)
    const lower = percentage - (percentage & 5)
    const higher = lower + 5
    score = Math.min(Math.abs(lower - 50) / 5, Math.abs(higher - 50) / 5) * 10

    return score
  }
  sum += getLineGroupScore()
  sum += getSquareScore()
  sum += getFinderConfusionScore()
  sum += getColorImbalanceScore()
  return sum
}
function applyMasking(functionalMatrix: boolean[][], dataMatrix: boolean[][]) {
  const maskMatrix = (matrix, condition) => {
    const copy = cloneMatrix(matrix)
    for (let y = 0; y < copy.length; y++) {
      for (let x = 0; x < copy.length; x++) {
        if (condition(x, y)) {
          if (copy[y][x] !== null) {
            copy[y][x] = !copy[y][x]
          }
        }
      }
    }
    return copy
  }
  const maskingMethods = [
    (x, y) => (x + y) % 2 === 0,
    (x, y) => y % 2 === 0,
    (x, y) => x % 3 === 0,
    (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
    (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ]

  let matrices = maskingMethods.map((method) =>
    mergeMatrices(functionalMatrix, maskMatrix(dataMatrix, method)),
  )

  // let bestMatrix = matrices.reduce((acc, val)
  const bestMatrixOption = matrices.reduce(
    (acc, matrix, mask) => {
      const score = evaluateMasking(matrix)
      return score < acc.score ? { score, mask, matrix } : acc
    },
    { score: Number.POSITIVE_INFINITY, mask: 0, matrix: [] as boolean[][] },
  )

  return { mask: 6, matrix: matrices[6] } //todo
}
function createMatrix(dimensions: number): boolean[][] {
  return [...new Array(dimensions)].map((arr) =>
    [...new Array(dimensions)].fill(null),
  )
}
function initializeMatrix(config: QrConfig) {
  const dimensions = getDimensions(config)
  let functionalMatrix = createMatrix(dimensions)
  functionalMatrix = addFinderPatterns(dimensions, functionalMatrix)
  functionalMatrix = addAlignmentPatterns(
    table[config.version].alignmentPatterns,
    functionalMatrix,
  )
  functionalMatrix = addTimingPatterns(dimensions, functionalMatrix)
  functionalMatrix = addDarkModule(dimensions, functionalMatrix)
  functionalMatrix = addReservedAreas(config, functionalMatrix)

  return functionalMatrix
}

function applyFormatInformation(
  config: QrConfig,
  mask: number,
  matrix: boolean[][],
) {
  const dimensions = matrix.length
  let bits = { L: '01', M: '00', Q: '11', H: '10' }[config.errorCorrectionLevel]
  console.log(mask, bits)
  bits += numToBits(mask, 3)

  const generator = Uint8Array.from([1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1])
  const message = Uint8Array.from(
    (bits + pad0('', 10)).split('').map((el) => +el),
  )

  const { remainder } = divPoly(message, generator)
  bits += pad0(remainder.join(''), 10)

  bits = numToBits(parseInt(bits, 2) ^ 21522, 15)

  let j = 0

  const horizontal = [
    ...range(0, 5 + 1),
    7,
    8,
    ...range(dimensions - 7, dimensions),
  ]
  const vertical = [
    ...range(0, 6 + 1),
    8,
    ...range(dimensions - 7, dimensions),
  ].reverse()

  horizontal.forEach((i) => {
    matrix[8][i] = bits[j++] === '1'
  })
  j = 0
  vertical.forEach((i) => {
    matrix[i][8] = bits[j++] === '1'
  })

  return matrix
}

function mergeMatrices(
  matrix1: boolean[][],
  matrix2: boolean[][],
): boolean[][] {
  let result = cloneMatrix(matrix1)

  for (let y = 0; y < matrix1.length; y++) {
    for (let x = 0; x < matrix1[0].length; x++) {
      if (matrix1[y][x] === null) {
        result[y][x] = matrix2[y][x]
      }
    }
  }
  return result
}

function cloneMatrix(matrix: boolean[][]) {
  return matrix.slice().map((m) => m.slice())
}
export function place(config: QrConfig, data: string) {
  const dimensions = getDimensions(config)

  let functionalMatrix = initializeMatrix(config)

  let dataMatrix = applyData(dimensions, functionalMatrix, data)
  //let result = mergeMatrices(functionalMatrix, dataMatrix)
  let { mask, matrix } = applyMasking(functionalMatrix, dataMatrix)

  let result = applyFormatInformation(config, mask, matrix)
  return result
}
