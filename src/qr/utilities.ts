export function chunkString(content: string, length: number): string[] {
  const result: string[] = []

  let i = 0
  while (i * length < content.length) {
    result.push(content.substr(i * length, length))
    i++
  }

  return result
}
export function pad0(content: string, length: number) {
  const diff = length - content.length
  if (diff <= 0) return content

  let temp = ''
  for (let i = 0; i < diff; i++) {
    temp += '0'
  }
  return temp + content
}

export function numToBits(content: number, length: number) {
  return pad0(content.toString(2), length)
}

export function concatTypedArrays(a, b): Uint8Array {
  var c = new a.constructor(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

export function range(from: number, to: number): number[] {
  return Array(to - from)
    .fill(from)
    .map((x, y) => x + y)
}
