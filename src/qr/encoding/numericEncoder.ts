import { Encoder } from './encoder'
import { chunkString, numToBits } from '../utilities'

export class NumericEncoder extends Encoder {
  encodeSymbols(content: string) {
    return chunkString(content, 3)
      .map((num) => numToBits(+num, +num < 10 ? 4 : +num < 100 ? 7 : 10))
      .join('')
  }
}
