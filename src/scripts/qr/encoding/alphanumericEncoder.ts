import { Encoder } from './encoder'
import { chunkString, numToBits } from '../utilities'
const alphaNumericValueTable = (lookup: string) =>
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.split('').indexOf(lookup)

export class AlphanumericEncoder extends Encoder {
  encodeSymbols(content: string) {
    return chunkString(content, 2)
      .map(([first, last]) =>
        last !== undefined
          ? numToBits(
              alphaNumericValueTable(first) * 45 + alphaNumericValueTable(last),
              11,
            )
          : numToBits(alphaNumericValueTable(first), 6),
      )
      .join('')
  }
}
