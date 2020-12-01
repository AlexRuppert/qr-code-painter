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

  const templateContainer = document.querySelector('ul')
  const templates = {
    Email: 'MATMSG:TO: <email-address> ;SUB: <Subject> ;BODY: <Text>;;',
    Phone: 'tel:',
    Geolocation: 'geo:<lat>,<long>,<alt>',
    WiFi: 'WIFI:T:WPA;S: <ssid> ;P: <password> ;;',
    '× Cancel': undefined,
  }
  const buttons = {
    '#templates': () => templateContainer?.classList.toggle('hidden'),
    '#clear': () => setInput(''),
    '#download': () =>
      saveSvg(
        canvas,
        document.querySelector('#downloader') as HTMLAnchorElement,
      ),
    svg: (el: any) => el.target.classList.toggle('mini'),
  }

  for (const [key, value] of Object.entries(buttons)) {
    ;[...document.querySelectorAll(key)].forEach((el) =>
      el.addEventListener('click', value),
    )
  }

  const setInput = (value: string | undefined | null) => {
    if (value != null) {
      input.value = value
      input.focus()
      createQr()
    }
  }

  const updateFromUrl = () => {
    setInput(new URL(window.location.href).searchParams.get('q'))
  }

  for (const [key, value] of Object.entries(templates)) {
    const li = document.createElement('li')
    li.textContent = key
    li.addEventListener('click', () => {
      setInput(value)
      templateContainer?.classList.add('hidden')
    })
    templateContainer?.appendChild(li)
  }

  const createQr = () => {
    const value = input.value
    clear(canvas)
    if (value !== '') {
      try {
        render(canvas, getMatrix(value))
      } catch (error) {
        alert('The input was too long for QR!')
      }
    }
  }

  input.addEventListener('input', debounce(createQr, 100))
  setInput('')
  updateFromUrl()
  window.addEventListener('locationchange', updateFromUrl)
}
