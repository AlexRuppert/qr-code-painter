import generate from './qr/generator'
import { render } from './qr/renderer'
//@ts-ignore
module?.hot?.accept()

window.onload = () => {
  /*let matrix = [
    [1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0],
  ]*/
  let matrix = generate('HELLO WORLD')
  render(document.getElementById('canvas') as HTMLElement, matrix)
}
