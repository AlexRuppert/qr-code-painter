import { QrParameters } from '../parameters'
import {
  chunkString,
  numToBits,
  pad0,
  concatTypedArrays,
  get0s,
} from '../utilities'
import { getEcWords } from '../errorCorrection/reedSolomon'
export class Encoder {
  protected config: QrParameters
  constructor(config: QrParameters) {
    this.config = config
  }
  encodeSymbols(content: string) {
    return '1'
  }

  createBlocks(encodedData: Uint8Array) {
    let currentElement = 0
    return this.config.groups
      .map((group) => {
        const blocks = new Array(group.blocks)
        for (let b = 0; b < blocks.length; b++) {
          blocks[b] = new Uint8Array(group.wordsPerBlock)
          for (let i = 0; i < group.wordsPerBlock; i++)
            blocks[b][i] = encodedData[currentElement++]
        }
        return blocks
      })
      .flat()
  }

  interleave(blocks: Uint8Array[]) {
    const maxLength = Math.max(...blocks.map((b) => b.length))
    const sumLength = blocks.reduce((acc, val) => acc + val.length, 0)
    const result = new Uint8Array(sumLength)
    let count = 0
    for (let i = 0; i < maxLength; i++)
      for (let j = 0; j < blocks.length; j++)
        if (i < blocks[j].length) result[count++] = blocks[j][i]

    return result
  }

  encode(content: string) {
    let encodedData = chunkString(
      this.fillUpBits(this.prefix(content) + this.encodeSymbols(content)),
      8,
    )
    let byteArray: Uint8Array = Uint8Array.from(
      encodedData.map((el) => parseInt(el, 2)),
    )

    const blocks = this.createBlocks(byteArray)
    const ecBlocks = blocks.map((b) =>
      getEcWords(b, this.config.groups[0].ecPerBlock),
    )
    byteArray = this.interleave(blocks)
    let ecByteArray = this.interleave(ecBlocks)

    let bits =
      Array.from(concatTypedArrays(byteArray, ecByteArray))
        .map((uint) => numToBits(uint, 8))
        .flat()
        .join('') + this.suffix()

    return bits
  }

  fillUpBits(bits: string) {
    const diff = this.config.requiredNumberOfBits - bits.length
    if (diff > 0) {
      bits += get0s(Math.min(diff, 4)) //fill up to 0000
      bits += get0s(8 - (bits.length % 8)) //fill up to be multiple of 8

      while (bits.length < this.config.requiredNumberOfBits)
        bits += '1110110000010001' //fill up until required number of bits

      return bits.substr(0, this.config.requiredNumberOfBits)
    }

    throw new Error('encodedData larger than allowed number of bits')
  }

  prefix(content: string) {
    let mode = numToBits(this.config.mode, 4)
    let countIndicator = numToBits(
      content.length,
      this.config.characterCountBits,
    )
    return mode + countIndicator
  }
  suffix() {
    return pad0('', this.config.remainderBits)
  }
}
