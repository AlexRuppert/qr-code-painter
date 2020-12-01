function generateExponentsLookUpTable() {
  const table = [1]
  while (table.length < 256) {
    const last = table[table.length - 1]
    let next = last << 1
    if (next > 255) next ^= 285

    table.push(next)
  }
  return Object.assign({}, table)
}
function flip(obj: Object) {
  const result = {}
  Object.keys(obj).forEach((key) => (result[obj[key]] = +key))
  return result
}

export const exponents = generateExponentsLookUpTable()
export const logs = { ...flip(exponents), 1: 0 }

function mul(x: number, y: number) {
  if (x === 0 || y === 0) return 0
  return exponents[(logs[x] + logs[y]) % 255]
}

function mulPoly(poly1: Uint8Array, poly2: number[]) {
  const result: Uint8Array = new Uint8Array(poly1.length + poly2.length - 1)
  poly1.forEach((p1, j) =>
    poly2.forEach((p2, i) => (result[j + i] ^= mul(p2, p1))),
  )

  return result
}

export function divPoly(dividend: Uint8Array, divisor: Uint8Array) {
  let result = dividend.slice()
  for (let i = 0; i < dividend.length - (divisor.length - 1); i++) {
    let coef = result[i]
    if (coef !== 0)
      for (let j = 1; j < divisor.length; j++)
        if (divisor[j] != 0) result[i + j] ^= mul(divisor[j], coef)
  }

  let remainder = result.slice(result.length - (divisor.length - 1))
  return remainder
}

export function generatorPoly(n: number) {
  const pow = (x: number, power: number) => exponents[(logs[x] * power) % 255]
  let g = Uint8Array.from([1])
  for (let i = 0; i < n; i++) g = mulPoly(g, [1, pow(2, i)])

  return g
}
