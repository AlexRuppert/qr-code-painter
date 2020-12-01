import { getParameters } from './parameters'
import { EncoderFactory } from './encoding/encoderFactory'
import { place } from './modulePlacement/placeModules'

export default function getMatrix(content: string) {
  const config = getParameters(content)
  let bitString = EncoderFactory(config).encode(content)
  return place(config, bitString)
}
