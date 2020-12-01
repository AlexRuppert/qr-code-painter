import { QrParameters } from '../parameters'
import { createMatrix } from '../utilities'
import { applyMasking } from './applyMasking'
import { getPatternMatrix } from './applyPatterns'
import {
  applyFormatInformation,
  applyVerisonInformation as applyVersionInformation,
} from './applyInfo'
enum MoveDirection {
  Up = -1,
  Down = 1,
}

function applyData(patternMatrix: boolean[][], data: string) {
  let dataMatrix = createMatrix(patternMatrix.length)
  const MAX = patternMatrix.length - 1
  let x = MAX
  let dx = 0
  let y = MAX
  let d = 0
  let direction: MoveDirection = MoveDirection.Up

  while (d < data.length) {
    if (patternMatrix[y][x - dx] === null)
      //only empty fields, otherwise skip
      dataMatrix[y][x - dx] = data[d++] === '1'

    if (dx === 1) {
      y += direction //go up or down
      if (y < 0 || y > MAX) {
        //flip direction if reaching top or bottom, move column to left
        y = (MAX + MAX * direction) / 2
        direction *= -1
        x -= 2
      }
    }
    dx ^= 1 //alternate from right to left in each column

    if (x >= 6 && x <= 7)
      //next to vertical timing pattern? -> skip
      x = 5
  }
  return dataMatrix
}

export function place(config: QrParameters, data: string) {
  let patternMatrix = getPatternMatrix(config)
  let dataMatrix = applyData(patternMatrix, data)
  let { mask, matrix } = applyMasking(patternMatrix, dataMatrix)
  let result = applyFormatInformation(config, mask, matrix)
  result = applyVersionInformation(config, matrix)

  return result
}
