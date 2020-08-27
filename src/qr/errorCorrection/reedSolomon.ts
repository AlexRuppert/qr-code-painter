import { divPoly, generatorPoly } from './galoisField'
import { concatTypedArrays } from '../utilities'
export function getEcWords(
  message: Uint8Array,
  ecCodeWordsCount: number,
): Uint8Array {
  //pad
  message = concatTypedArrays(message, new Uint8Array(ecCodeWordsCount))

  const remainder = divPoly(message, generatorPoly(ecCodeWordsCount))
  return remainder
}
