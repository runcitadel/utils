import { convert } from '.';

// Test conversion from  one unit to itself
test('convert from one unit to itself changes nothin', () => {
  expect(convert(1, 'btc', 'btc', 'Number')).toBe(1);
  expect(convert(10, 'sat', 'sat', 'Number')).toBe(10);
});

// Test conversion from one unit to another
test('convert from one unit to another changes value correctly', () => {
    expect(convert(1, 'btc', 'sat', 'Number')).toBe(100000000);
    expect(convert(1, 'sat', 'btc', 'Number')).toBe(0.00000001);
    expect(convert(1, 'btc', 'mbtc', 'Number')).toBe(1000);
    expect(convert(1, 'btc', 'μbtc', 'Number')).toBe(1000000);
});