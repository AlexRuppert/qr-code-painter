import { Encoder } from './encoder'
import { numToBits, encodeUtf8 } from '../utilities'

export class ByteEncoder extends Encoder {
  encodeSymbols(content: string) {
    return [...encodeUtf8(content)].map((el) => numToBits(el, 8)).join('')
  }
}
