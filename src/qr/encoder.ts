import { QrConfig } from './selectConfig'
import { chunkString, numToBits, pad0, concatTypedArrays } from './utilities'
import definitions from './definitions'
import { generate } from './reedSolomon'
class Encoder {
  protected config: QrConfig
  protected content: string
  protected definition: {
    ecPerBlock: number
    groups: [
      {
        blocks: number
        dataCodeWordsPerBlock: number
      },
    ]
  }
  constructor(config: QrConfig, content: string) {
    this.config = config
    this.content = content
    this.definition =
      definitions[this.config.version][this.config.errorCorrectionLevel]
  }
  get requiredNumberofBits() {
    return (
      this.definition.groups
        .map((group) => group.blocks * group.dataCodeWordsPerBlock)
        .reduce((acc, val) => acc + val, 0) * 8
    )
  }
  encodeSymbols() {
    return '1'
  }
  createBlocks(encodedData: Uint8Array) {
    let currentElement = 0
    return this.definition.groups
      .map((group) => {
        const blocks = new Array(group.blocks)

        for (let b = 0; b < blocks.length; b++) {
          blocks[b] = [] as number[]
          for (let i = 0; i < group.dataCodeWordsPerBlock; i++) {
            blocks[b].push(encodedData[currentElement++])
          }
        }
        return blocks.map((b) => Uint8Array.from(b))
      })
      .flat()
  }

  interleave(blocks: Uint8Array[]) {
    const maxLength = Math.max(...blocks.map((b) => b.length))
    const sumLength = blocks.reduce((acc, val) => acc + val.length, 0)
    const result = new Uint8Array(sumLength)
    let count = 0
    for (let i = 0; i < maxLength; i++) {
      for (let j = 0; j < blocks.length; j++) {
        if (i < blocks[j].length) {
          result[count++] = blocks[j][i]
        }
      }
    }

    return result
  }
  encode() {
    let encodedData = chunkString(
      this.fillUpBits(this.prefix() + this.encodeSymbols()),
      8,
    )
    let byteArray: Uint8Array = Uint8Array.from(
      encodedData.map((el) => parseInt(el, 2)),
    )

    const blocks = this.createBlocks(byteArray)
    const ecBlocks = blocks.map((b) => generate(b, this.definition.ecPerBlock))
    byteArray = this.interleave(blocks)
    let ecByteArray = this.interleave(ecBlocks)

    let bits =
      Array.from(concatTypedArrays(byteArray, ecByteArray))
        .map((uint) => numToBits(uint, 8))
        .flat()
        .join('') + this.suffix()
    console.log(this.suffix())
    console.log(bits)
    return bits
  }
  fillUpBits(bits: string) {
    const diff = this.requiredNumberofBits - bits.length

    if (diff > 0) {
      bits += pad0('', Math.min(diff, 4)) //fill up to 0000
      bits += pad0('', 8 - (bits.length % 8)) //fill up to be multiple of 8

      while (bits.length < this.requiredNumberofBits) {
        bits += '1110110000010001' //fill up until required number of bits
      }

      return bits.substr(0, this.requiredNumberofBits)
    }

    throw new Error('encodedData larger than allowed number of bits')
  }
  prefix() {
    let bits = numToBits(this.config.mode, 4) //mode
    bits += numToBits(this.content.length, this.config.characterCountBits) //count indicator

    return bits
  }
  suffix() {
    return pad0('', definitions[this.config.version].remainderBits)
  }
}

class AlphanumericEncoder extends Encoder {
  private table = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 18,
    J: 19,
    K: 20,
    L: 21,
    M: 22,
    N: 23,
    O: 24,
    P: 25,
    Q: 26,
    R: 27,
    S: 28,
    T: 29,
    U: 30,
    V: 31,
    W: 32,
    X: 33,
    Y: 34,
    Z: 35,
    ' ': 36,
    $: 37,
    '%': 38,
    '*': 39,
    '+': 40,
    '-': 41,
    '.': 42,
    '/': 43,
    ':': 44,
  }

  encodeSymbols() {
    return chunkString(this.content, 2)
      .map(([first, last]) => {
        if (last !== undefined) {
          return numToBits(this.table[first] * 45 + this.table[last], 11)
        } else {
          return numToBits(this.table[first], 6)
        }
      })
      .join('')
  }
}

export function EncoderFactory(config: QrConfig, content: string) {
  return new AlphanumericEncoder(config, content)
}
