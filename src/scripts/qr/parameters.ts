import {
  EcLevels,
  getAlignmentPattern,
  getChracterCountBits,
  getDimensions,
  getGroups,
  getRemainderBits,
  getRequiredNumberOfBits,
} from './definitions'
import { encodeUtf8 } from './utilities'
export type QrParameters = {
  ecLevel: EcLevels
  version: number
  mode: QrModes
  characterCountBits: number
  requiredNumberOfBits: number
  remainderBits: number
  dimensions: number
  alignmentPattern: number[]

  groups: Array<{ blocks: number; wordsPerBlock: number; ecPerBlock: number }>
}

export enum QrModes {
  Numeric = 1,
  Alphanumeric = 2,
  Byte = 4,
  Kanji = 8,
  EXI = 7,
}

function getMode(content: string) {
  if (/^\d*$/.test(content)) return QrModes.Numeric
  if (/^[0-9A-Z \$%\*\+\-\.\/:]*$/.test(content)) return QrModes.Alphanumeric
  return QrModes.Byte
}

function getSmallestVersion(length: number, mode: QrModes) {
  const ecLevel = EcLevels.L
  let version, groups, requiredNumberOfBits, characterCountBits
  for (version = 1; version <= 40; version++) {
    groups = getGroups(version, ecLevel)
    requiredNumberOfBits = getRequiredNumberOfBits(groups)
    characterCountBits = getChracterCountBits(version, mode)
    let upperLimit = 0
    const availableBits = requiredNumberOfBits - (4 + characterCountBits)
    switch (mode) {
      case QrModes.Numeric:
        upperLimit = Math.floor((availableBits / 10) * 3)
        break
      case QrModes.Alphanumeric:
        upperLimit = Math.floor((availableBits / 11) * 2)
        break
      default:
        upperLimit = Math.floor(availableBits / 8)
        break
    }

    if (length <= upperLimit) break
  }

  if (version > 40) {
    throw new Error('Input too long!')
  }
  return { version, ecLevel, groups, requiredNumberOfBits, characterCountBits }
}

export function getParameters(content: string): QrParameters {
  const mode = getMode(content)

  const {
    version,
    ecLevel,
    groups,
    requiredNumberOfBits,
    characterCountBits,
  } = getSmallestVersion(encodeUtf8(content).length, mode)

  return {
    ecLevel,
    version,
    mode,
    characterCountBits,
    requiredNumberOfBits,
    remainderBits: getRemainderBits(version),
    dimensions: getDimensions(version),
    alignmentPattern: getAlignmentPattern(version),
    groups,
  }
}
