export function commify(value) {
  const splitedValue = value.split('.')
  let parts2 = ''
  const parts = splitedValue[0].replace(/[\s,]/g, '')

  const thousands = /\B(?=(\d{3})+(?!\d))/g
  if (splitedValue.length > 1) {
    parts2 = '.' + splitedValue[1]
  }

  return parts.replace(thousands, ',') + parts2
}
