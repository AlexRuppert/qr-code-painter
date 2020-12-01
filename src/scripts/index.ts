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
  const input = document.querySelector('textarea') as HTMLTextAreaElement
  const hiddenDownloadHelper = document.getElementById(
    'downloader',
  ) as HTMLAnchorElement
  const buttons = {
    '#templates': () =>
      document.getElementById('template-container')?.classList.toggle('hidden'),
    '#clear': () => setInput(''),
    '#download': () => saveSvg(canvas, hiddenDownloadHelper),
  }

  for (const [key, value] of Object.entries(buttons)) {
    ;[...document.querySelectorAll(key)].forEach((el) =>
      el.addEventListener('click', value),
    )
  }

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

  ;[...document.querySelectorAll('#template-container li')].map((el) => {
    let item = el as HTMLElement
    item.addEventListener('click', () => {
      if (item.dataset.template) {
        setInput(item.dataset.template)
      }
      item.parentElement?.classList.add('hidden')
    })
  })
  canvas.addEventListener('click', () => {
    canvas.style.maxWidth = canvas.style.maxWidth ? '' : '400px'
  })

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
}
