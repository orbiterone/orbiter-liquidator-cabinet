import BigNumber from 'bignumber.js'

export function transform(value: string, precision = 4): string {
  return new BigNumber(value || String(0))
    .decimalPlaces(precision, BigNumber.ROUND_DOWN)
    .toFormat({
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      fractionGroupSeparator: '',
      fractionGroupSize: 0,
    })
}
