import { QrConfig, getConfig } from './selectConfig'
import { EncoderFactory } from './encoder'
import { place } from './modulePlacer'

export default function generate(content: string) {
  const config: QrConfig = getConfig(content)

  const encoder = EncoderFactory(config, content)
  let data = encoder.encode()

  const matrix = place(config, data)
  return matrix
}
