import { divPoly, generatorPoly } from './galoisField'
import { concatTypedArrays } from './utilities'
export function generate(message: Uint8Array, ecCodeWords: number): Uint8Array {
  let generator = Uint8Array.from(generatorPoly(ecCodeWords))

  //pad
  message = concatTypedArrays(message, new Uint8Array(ecCodeWords))

  const { remainder } = divPoly(message, generator)
  return remainder
}
