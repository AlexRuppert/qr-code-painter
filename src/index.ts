import getMatrix from './qr/matrixGenerator'
import { render } from './qr/renderer'

try {
  //@ts-ignore
  module.hot.accept()
} catch (error) {}

window.onload = () => {
  let matrix = getMatrix('HI WELT!')

  const canvas = document.getElementById('canvas') as HTMLElement
  render(canvas, matrix)
}
