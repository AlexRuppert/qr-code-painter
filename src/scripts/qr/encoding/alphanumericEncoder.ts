import { Encoder } from './encoder'
import { chunkString, numToBits } from '../utilities'
const alphaNumericValueTable = (lookup: string) =>
  [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    ' ',
    '$',
    '%',
    '*',
    '+',
    '-',
    '.',
    '/',
    ':',
  ].indexOf(lookup)

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
