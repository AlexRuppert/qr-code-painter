import { Encoder } from './encoder'
import { numToBits } from '../utilities'

export class ByteEncoder extends Encoder {
  encodeSymbols(content: string) {
    return content
      .split('')
      .map((char) => numToBits(char.charCodeAt(0), 8))
      .join('')
  }
}
