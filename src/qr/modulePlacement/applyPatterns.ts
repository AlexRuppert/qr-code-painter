import { QrParameters } from '../parameters'
import { createMatrix, range } from '../utilities'

function applyFinderPatterns(matrix: boolean[][]) {
  const dimensions = matrix.length
  const drawSquares = (x: number, y: number) => {
    for (let j = 0; j < 3; j++)
      for (let i = 0 + j; i < 7 - j; i++)
        matrix[y + j][x + i] = matrix[y + 6 - j][x + i] = matrix[y + i][
          x + j
        ] = matrix[y + i][x + 6 - j] = j % 2 == 0

    matrix[y + 3][x + 3] = true
  }

  const drawGapNextToSquares = () => {
    for (let i = 0; i < 8; i++)
      matrix[i][7] = matrix[dimensions - i - 1][7] = matrix[7][i] = matrix[7][
        dimensions - i - 1
      ] = matrix[dimensions - 7 - 1][i] = matrix[i][dimensions - 7 - 1] = false
  }

  drawSquares(0, 0)
  drawSquares(0, dimensions - 7)
  drawSquares(dimensions - 7, 0)
  drawGapNextToSquares()
}

function applyTimingPatterns(matrix: boolean[][]) {
  for (let i = 7; i < matrix.length - 7; i++)
    matrix[6][i] = matrix[i][6] = i % 2 === 0
}

function applyDarkModule(matrix: boolean[][]) {
  matrix[matrix.length - 8][8] = true
}

function applyReservedAreas(version: number, matrix: boolean[][]) {
  const dimensions = matrix.length
  ;[...range(0, 9), ...range(dimensions - 8, dimensions)].forEach(
    (i) => (matrix[i][8] = matrix[8][i] = false),
  )

  //for version >=7 codes add additional areas
  if (version >= 7)
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 6; j++)
        matrix[dimensions - 11 + i][j] = matrix[j][dimensions - 11 + i] = false
}

function applyAlignmentPatterns(locations: number[], matrix: boolean[][]) {
  const drawPattern = (x: number, y: number) => {
    for (let j = 0; j < 3; j++)
      for (let i = 0 + j; i < 5 - j; i++)
        matrix[y + j][x + i] = matrix[y + 4 - j][x + i] = matrix[y + i][
          x + j
        ] = matrix[y + i][x + 4 - j] = j % 2 == 0
  }

  const [minLocation, maxLocation] = [
    Math.min(...locations),
    Math.max(...locations),
  ]
  locations
    .map((x, i, array) => array.map((y) => [x, y])) //all coordinate combinations
    .flat()
    .filter(
      //do not draw if it overlaps the finder patterns
      ([x, y]) =>
        !(
          (x === minLocation && (y === minLocation || y === maxLocation)) ||
          (y === minLocation && (x === minLocation || x === maxLocation))
        ),
    ) //add -2 offset, as location-coordinates use center, while we use top-left
    .map(([x, y]) => [x - 2, y - 2])
    .forEach(([x, y]) => drawPattern(x, y))
}

export function getPatternMatrix(config: QrParameters) {
  let patternMatrix = createMatrix(config.dimensions)
  applyFinderPatterns(patternMatrix)
  applyAlignmentPatterns(config.alignmentPattern, patternMatrix)
  applyReservedAreas(config.version, patternMatrix)
  applyTimingPatterns(patternMatrix)
  applyDarkModule(patternMatrix)
  return patternMatrix
}
