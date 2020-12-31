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
  const menu = document.querySelector('#menu-container') as HTMLElement
  const favorites = document.querySelector('#favorites') as HTMLElement
  const installButton = document.querySelector('#install') as HTMLElement
  const templateContainer = document.querySelector('ul#templates')

  let deferredInstallPrompt

  // prettier-ignore
  const templates = {
    'Email': 'MATMSG:TO: <email-address> ;SUB: <Subject> ;BODY: <Text>;;',
    'Phone': 'tel:',
    'Geolocation': 'geo:<lat>,<long>,<alt>',
    'WiFi': 'WIFI:T:WPA;S: <ssid> ;P: <password> ;;',
  }
  const buttons = {
    '#menu-button': () => {
      document
        .querySelectorAll('#menu-container, #menu-button')
        .forEach((el) => el.classList.toggle('open'))
    },
    body: (event) => {
      if (
        ![
          ...document.querySelectorAll('#menu-container, #menu-button'),
        ].some((el) => el.contains(event.target))
      ) {
        closeMenu()
      }
    },
    '#clear': () => setInput(''),
    '#download': () =>
      saveSvg(
        canvas,
        document.querySelector('#downloader') as HTMLAnchorElement,
      ),
    svg: (el: any) => el.target.classList.toggle('mini'),
    '#favorite': () => saveFavorite(),
    '#install': async () => {
      deferredInstallPrompt.prompt()
      const choice = deferredInstallPrompt.userChoice
      if (choice.outcome === 'accepted') {
        hide(installButton)
      }
    },
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

  ;[...menu.querySelectorAll('li > ul')].forEach((el) => {
    hide(el)
    el.parentElement?.addEventListener('click', () => {
      toggleVisibility(el)
    })
  })

  for (const [key, value] of Object.entries(templates)) {
    const li = document.createElement('li')
    li.innerHTML = `<span>${key}</span>`
    li.addEventListener('click', () => {
      setInput(value)
      closeMenu()
    })
    templateContainer?.appendChild(li)
  }

  const closeMenu = () =>
    document
      .querySelectorAll('#menu-container, #menu-button')
      .forEach((el) => el.classList.remove('open'))

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
  const saveFavorite = () => {
    const name = prompt('Please give a name for quick access:')
    if (name?.length) {
      localStorage.setItem(name, input.value)
    }
    updateFavorites()
  }

  const updateFavorites = () => {
    favorites.innerHTML = ''
    let storage = Object.entries({ ...localStorage })
    storage.sort((a: [string, string], b: [string, string]) =>
      a[0].localeCompare(b[0]),
    )

    storage.forEach(([key, value]) => {
      const li = document.createElement('li')
      const span = document.createElement('span')
      const remove = document.createElement('a')
      remove.innerText = '×'
      span.innerText = key
      li.appendChild(span)
      li.appendChild(remove)
      span.addEventListener('click', () => {
        setInput(value)
        closeMenu()
      })
      remove.addEventListener('click', (e) => {
        e.stopPropagation()
        localStorage.removeItem(key)
        updateFavorites()
      })
      favorites.appendChild(li)
    })
  }

  input.addEventListener('input', debounce(createQr, 100))
  setInput('')
  updateFromUrl()
  updateFavorites()
  window.addEventListener('locationchange', updateFromUrl)

  window.addEventListener('beforeinstallprompt', (e) => {
    deferredInstallPrompt = e

    if (
      !(
        window.matchMedia('(display-mode: standalone)').matches ||
        navigator['standalone']
      )
    )
      show(installButton)
  })
  window.addEventListener('appinstalled', (evt) => {
    hide(installButton)
  })
}

function classListHidden(
  element: HTMLElement,
  operation: 'add' | 'remove' | 'toggle',
) {
  element.classList[operation]('hidden')
}

function hide(element) {
  classListHidden(element, 'add')
}
function show(element) {
  classListHidden(element, 'remove')
}
function toggleVisibility(element) {
  classListHidden(element, 'toggle')
}
