function generate() {
  const table = [1]
  while (table.length < 256) {
    const last = table[table.length - 1]
    let next = last << 1

    if (next > 255) {
      next ^= 285
    }
    table.push(next)
  }
  return Object.assign({}, table)
}
function flip(obj: Object) {
  const result = {}
  Object.keys(obj).forEach((key) => {
    result[obj[key]] = +key
  })
  return result
}

export const exponents = generate()
export const logs = { ...flip(exponents), 1: 0 }

const mul = (x: number, y: number) => {
  if (x === 0 || y === 0) return 0
  return exponents[(logs[x] + logs[y]) % 255]
}

const pow = (x: number, power: number) => exponents[(logs[x] * power) % 255]

const mulPoly = (poly1: number[], poly2: number[]) => {
  const result: number[] = new Array(poly1.length + poly2.length)
  poly1.forEach((p1, j) => {
    poly2.forEach((p2, i) => {
      result[j + i] ^= mul(p2, p1)
    })
  })
  return result.filter((el) => el != undefined)
}

export const divPoly = (dividend, divisor) => {
  let result = dividend.slice()
  for (let i = 0; i < dividend.length - (divisor.length - 1); i++) {
    let coef = result[i]
    if (coef !== 0) {
      for (let j = 1; j < divisor.length; j++) {
        if (divisor[j] != 0) {
          result[i + j] ^= mul(divisor[j], coef)
        }
      }
    }
  }
  let separator = divisor.length - 1

  return {
    quotient: result.slice(0, result.length - separator),
    remainder: result.slice(result.length - separator),
  }
}
//https://en.wikipedia.org/wiki/Horner%27s_method
export const evalPoly = (poly: number[], x: number) => {
  let y = poly[0]
  for (let i = 1; i < poly.length; i++) {
    y = mul(y, x) ^ poly[i]
  }
  return y
}

export const generatorPoly = (n) => {
  let g = [1]
  for (let i = 0; i < n; i++) {
    g = mulPoly(g, [1, pow(2, i)])
  }
  return g
}
