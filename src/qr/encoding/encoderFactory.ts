import { QrModes, QrParameters } from '../parameters'
import { AlphanumericEncoder } from './alphanumericEncoder'
import { ByteEncoder } from './byteEncoder'
import { NumericEncoder } from './numericEncoder'
export function EncoderFactory(config: QrParameters) {
  switch (config.mode) {
    case QrModes.Alphanumeric:
      return new AlphanumericEncoder(config)
    case QrModes.Numeric:
      return new NumericEncoder(config)
    //nope, Kanji support does not seem reasonable as it wopuld require to add Shift JIS support for the mapping
    //just use utf8
    default:
      return new ByteEncoder(config)
  }
}
