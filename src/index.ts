import getMatrix from './qr/matrixGenerator'
import { render, clear } from './qr/renderer'
import { debounce } from './qr/utilities'

try {
  //@ts-ignore
  module.hot.accept()
} catch (error) {}

window.onload = () => {
  const canvas = document.querySelector('svg') as SVGSVGElement
  const input = document.getElementById('input') as HTMLInputElement
  const pasteButton = document.getElementById('paste') as HTMLElement
  const clearButton = document.getElementById('clear') as HTMLElement

  const setInput = (value: string) => {
    input.value = value
    input.focus()
    createQr()
  }
  clearButton.addEventListener('click', () => {
    setInput('')
  })

  if (
    navigator.clipboard !== undefined &&
    navigator.clipboard.readText !== undefined
  ) {
    pasteButton.addEventListener('click', async () => {
      setInput(await navigator.clipboard.readText())
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

  input.addEventListener('input', debounce(createQr, 100))
  setInput('')

  const query = new URL(window.location.href).searchParams.get('q')
  if (query) setInput(query)
}
