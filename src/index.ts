import getMatrix from './qr/matrixGenerator'
import { render, clear } from './qr/renderer'
import { debounce } from './qr/utilities'

try {
  //@ts-ignore
  module.hot.accept()
} catch (error) {}

const canvas = document.getElementById('canvas') as HTMLElement
const input = document.getElementById('input') as HTMLInputElement
const pasteButton = document.getElementById('paste') as HTMLElement
const clearButton = document.getElementById('clear') as HTMLElement
clearButton.addEventListener('click', () => {
  input.value = ''
  input.focus()
})

if (navigator.clipboard !== undefined) {
  pasteButton.addEventListener('click', async () => {
    input.value = await navigator.clipboard.readText()
    createQr()
  })
} else {
  pasteButton.style.display = 'none'
}

const createQr = () => {
  const value = input.value
  if (value.length > 0) {
    try {
      render(canvas, getMatrix(value))
    } catch (error) {
      clear(canvas)
      alert('The input was too long for QR!')
    }
  } else {
    clear(canvas)
  }
}

input.addEventListener('input', debounce(createQr, 350))
input.focus()
