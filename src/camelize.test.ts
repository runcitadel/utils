import { camelize } from ".";

// Test the camelize function.
test('Camelize strings correctly', () => {
  expect(camelize('example_string')).toBe('exampleString');
  expect(camelize('exampleString')).toBe('exampleString');
  expect(camelize('example _ string')).toBe('example _ string');
});

test('Camelize object keys correctly', () => {
  expect(camelize({ example_property: 'example_value' })).toEqual({
    exampleProperty: 'exampleValue',
  });
  expect(camelize({ exampleProperty: 'exampleValue' })).toEqual({
    exampleProperty: 'exampleValue',
  });
  // Check camelize on array with strings and objects.
  expect(camelize([{ example_property: 'example_value' }, 'example_string'])).toEqual([
    { exampleProperty: 'exampleValue' },
    'exampleString',
  ]);
});
