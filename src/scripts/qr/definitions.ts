import { QrModes } from './parameters'
import { chunkString } from './utilities'

export enum EcLevels {
  L = 0,
  M = 1,
  Q = 2,
  H = 3,
}

//interleaved data --> ecPerBlock, wordsPerBlock
const qrDefinitionTable = chunkString(
  '0011030906060a020325091a14141a0908441834100a1406126710231816090218921633100814041056091916111a0812651022100718061682142914101807219a1427120916051056183316111a081268213a1a1416051678142718121a0718911428161214042199163012091605147316312116160516831a35161121081a911a361a141a0721a318331a141a071a971834181318061a91183121161a081a9a18321a1421091a951a362116160621a41a372116210821a01a352116210918901a37211621081a981a361a14210921a51a352115210821a01a3521162108219a1a352115210821991a372116210821991a362116210821991a362116210821991a362116210821991a362116210921a41a372116210821a41a372116210821a51a362116210821a51a362116210821a01a372116210821a11a3721162108',
  2,
).map(
  (s) => parseInt(s, 11) + 7,
) /*[
  7,
  19,
  10,
  16,
  13,
  13,
  17,
  9,
  10,
  34,
  16,
  28,
  22,
  22,
  28,
  16,
  15,
  55,
  26,
  44,
  18,
  17,
  22,
  13,
  20,
  80,
  18,
  32,
  26,
  24,
  16,
  9,
  26,
  108,
  24,
  43,
  18,
  15,
  22,
  11,
  18,
  68,
  16,
  27,
  24,
  19,
  28,
  15,
  20,
  78,
  18,
  31,
  18,
  14,
  26,
  13,
  24,
  97,
  22,
  38,
  22,
  18,
  26,
  14,
  30,
  116,
  22,
  36,
  20,
  16,
  24,
  12,
  18,
  68,
  26,
  43,
  24,
  19,
  28,
  15,
  20,
  81,
  30,
  50,
  28,
  22,
  24,
  12,
  24,
  92,
  22,
  36,
  26,
  20,
  28,
  14,
  26,
  107,
  22,
  37,
  24,
  20,
  22,
  11,
  30,
  115,
  24,
  40,
  20,
  16,
  24,
  12,
  22,
  87,
  24,
  41,
  30,
  24,
  24,
  12,
  24,
  98,
  28,
  45,
  24,
  19,
  30,
  15,
  28,
  107,
  28,
  46,
  28,
  22,
  28,
  14,
  30,
  120,
  26,
  43,
  28,
  22,
  28,
  14,
  28,
  113,
  26,
  44,
  26,
  21,
  26,
  13,
  28,
  107,
  26,
  41,
  30,
  24,
  28,
  15,
  28,
  116,
  26,
  42,
  28,
  22,
  30,
  16,
  28,
  111,
  28,
  46,
  30,
  24,
  24,
  13,
  30,
  121,
  28,
  47,
  30,
  24,
  30,
  15,
  30,
  117,
  28,
  45,
  30,
  24,
  30,
  16,
  26,
  106,
  28,
  47,
  30,
  24,
  30,
  15,
  28,
  114,
  28,
  46,
  28,
  22,
  30,
  16,
  30,
  122,
  28,
  45,
  30,
  23,
  30,
  15,
  30,
  117,
  28,
  45,
  30,
  24,
  30,
  15,
  30,
  116,
  28,
  45,
  30,
  23,
  30,
  15,
  30,
  115,
  28,
  47,
  30,
  24,
  30,
  15,
  30,
  115,
  28,
  46,
  30,
  24,
  30,
  15,
  30,
  115,
  28,
  46,
  30,
  24,
  30,
  15,
  30,
  115,
  28,
  46,
  30,
  24,
  30,
  15,
  30,
  115,
  28,
  46,
  30,
  24,
  30,
  16,
  30,
  121,
  28,
  47,
  30,
  24,
  30,
  15,
  30,
  121,
  28,
  47,
  30,
  24,
  30,
  15,
  30,
  122,
  28,
  46,
  30,
  24,
  30,
  15,
  30,
  122,
  28,
  46,
  30,
  24,
  30,
  15,
  30,
  117,
  28,
  47,
  30,
  24,
  30,
  15,
  30,
  118,
  28,
  47,
  30,
  24,
  30,
  15,
]*/

export function getDimensions(version: number) {
  return (version - 1) * 4 + 21
}

function getSupportedBits(version: number) {
  const dimensions = getDimensions(version)
  const versionInfoModules = version >= 7 ? 36 : 0
  const alignmentElementsDimensions = 2 + Math.floor(version / 7)
  const alignmentModules =
    version <= 1
      ? 0
      : (Math.pow(alignmentElementsDimensions, 2) - 3) * 25 -
        (alignmentElementsDimensions - 2) * 10
  const bits =
    dimensions * dimensions -
    (49 + 15) * 3 -
    (dimensions - 14) * 2 -
    27 -
    alignmentModules -
    versionInfoModules

  return bits
}

export function getSupportedBytes(version: number) {
  return Math.floor(getSupportedBits(version) / 8)
}

export function getRemainderBits(version: number) {
  const bits = getSupportedBits(version)
  return bits % 8
}

export function getAlignmentPattern(version: number) {
  if (version <= 1) return []
  const last = 18 + 4 * (version - 2)
  const elements = 2 + Math.floor(version / 7)
  const startStep = Math.floor((last - 6) / (elements - 1))
  let firstStep = startStep
  let nextStep = startStep
  if (elements > 3) {
    for (firstStep = startStep; firstStep > 0; firstStep--) {
      nextStep = (last - 6 - firstStep) / (elements - 2)
      if (nextStep % 2 == 0) break
    }
  }

  const alignmentPattern = [6, 6 + firstStep]
  for (let i = 1; i < elements - 1; i++)
    alignmentPattern.push(6 + firstStep + i * nextStep)

  return alignmentPattern
}

export function getGroups(version: number, ecLevel: EcLevels) {
  const index = (version - 1) * 8 + ecLevel * 2
  let ecPerBlock = qrDefinitionTable[index]
  let wordsPerBlock = qrDefinitionTable[index + 1]

  let bytes = getSupportedBytes(version)
  let y = 0
  let x = 0
  for (x = 0; x <= 56; x++) {
    let candidate =
      (bytes - (ecPerBlock + wordsPerBlock) * x) /
      (ecPerBlock + wordsPerBlock + 1)

    if (candidate % 1 === 0) {
      y = candidate
      break
    }
  }
  const result = [{ blocks: x, wordsPerBlock, ecPerBlock }]
  if (y > 0) {
    result.push({ blocks: y, wordsPerBlock: wordsPerBlock + 1, ecPerBlock })
  }
  return result
}

export function getChracterCountBits(version: number, mode: QrModes) {
  let block =
    version >= 1 && version <= 9
      ? 0
      : version >= 10 && version <= 26
      ? 1
      : version >= 27 && version <= 40
      ? 2
      : -1

  if (block < 0) {
    throw new Error(`Invalid version: ${version}`)
  }

  switch (mode) {
    case QrModes.Numeric:
      return 10 + block * 2
    case QrModes.Alphanumeric:
      return 9 + block * 2
    case QrModes.Byte:
      return Math.min(8 + block * 8, 16)
    case QrModes.Kanji:
      return 8 + block * 2
    default:
      throw new Error(`Invalid mode: ${mode}`)
  }
}

export function getRequiredNumberOfBits(groups) {
  return (
    groups.reduce((acc, val) => acc + val.wordsPerBlock * val.blocks, 0) * 8
  )
}
