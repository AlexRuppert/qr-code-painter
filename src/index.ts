import getMatrix from './qr/matrixGenerator'
import { render, clear } from './svg/renderer'
import { debounce } from './qr/utilities'
import { saveSvg } from './svg/save'

try {
  //@ts-ignore
  module.hot.accept()
} catch (error) {}

window.onload = () => {
  const canvas = document.querySelector('svg') as SVGSVGElement
  const input = document.getElementById('input') as HTMLInputElement
  const pasteButton = document.getElementById('paste') as HTMLElement
  const clearButton = document.getElementById('clear') as HTMLElement
  const download = document.getElementById('download') as HTMLElement
  const hiddenDownloadHelper = document.getElementById(
    'downloader',
  ) as HTMLAnchorElement

  const setInput = (value: string | undefined) => {
    if (value !== undefined) {
      input.value = value
      input.focus()
      createQr()
    }
  }

  const updateFromUrl = () => {
    const query = new URL(window.location.href).searchParams.get('q')
    if (query) setInput(query)
  }
  clearButton.addEventListener('click', () => {
    setInput('')
  })

  canvas.addEventListener('click', () => {
    canvas.style.maxWidth = canvas.style.maxWidth ? '' : '400px'
  })

  download.addEventListener('click', () => {
    saveSvg(canvas, hiddenDownloadHelper)
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
  updateFromUrl()
  window.addEventListener('locationchange', updateFromUrl)
  ;[...document.querySelectorAll('#template-container a')].forEach((a) => {
    let item = a as HTMLElement
    if (item.dataset.template) {
      item.addEventListener('click', () => {
        setInput(item.dataset.template)
      })
    }
  })
}
