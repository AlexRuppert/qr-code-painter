export type QrConfig = {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  version: number
  mode: QrModes
  characterCountBits: number
}

export enum QrModes {
  Numeric = 1,
  Alphanumeric = 2,
  Byte = 4,
  Kanji = 8,
  EXI = 7,
}

function getChracterCountBits(version: number, mode: QrModes) {
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
export function getConfig(content: string): QrConfig {
  return {
    errorCorrectionLevel: 'Q',
    version: 1,
    mode: QrModes.Alphanumeric,
    characterCountBits: getChracterCountBits(1, QrModes.Alphanumeric),
  }
}
