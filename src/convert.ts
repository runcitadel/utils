// Source from https://github.com/richardschneider/bitcoin-convert/
import Big from 'big.js';

const units: Record<string, Big> = {
  btc: new Big(1),
  mbtc: new Big(0.001),
  μbtc: new Big(0.000001),
  bit: new Big(0.000001),
  satoshi: new Big(0.00000001),
  sat: new Big(0.00000001),
};

/**
 * Function to convert between Bitcoin units
 *
 * @param from The value to convert
 * @param fromUnit The unit the value has
 * @param toUnit The unit the result should have
 * @param representation The type the returned value should have. Possible values are ["String", "Number", "Big"]
 * @returns The converted value
 */
function convert(
  from: string | number | Big,
  fromUnit: string,
  toUnit: string,
  representation: 'String' | 'Number' | 'Big',
): string | number | Big {
  const fromFactor = units[fromUnit] || units[fromUnit.toLowerCase()];
  if (fromFactor === undefined) {
    throw new Error(`'${fromUnit}' is not a bitcoin unit`);
  }

  const toFactor = units[toUnit] || units[toUnit.toLowerCase()];
  if (toFactor === undefined) {
    throw new Error(`'${toUnit}' is not a bitcoin unit`);
  }

  if (Number.isNaN(from)) {
    if (!representation || representation === 'Number') {
      return from;
    }

    if (representation === 'Big') {
      return new Big(from); // Throws BigError
    }

    if (representation === 'String') {
      return from.toString();
    }

    throw new Error(`'${representation}' is not a valid representation`);
  }

  const result = new Big(from).times(fromFactor).div(toFactor);

  if (!representation || representation === 'Number') {
    return Number(result);
  }

  if (representation === 'Big') {
    return result;
  }

  if (representation === 'String') {
    return result.toString();
  }

  throw new Error(`'${representation}' is not a valid representation`);
}

convert.units = function () {
  return Object.keys(units);
};

convert.addUnit = function addUnit(unit: string, factor: number) {
  const bigFactor = new Big(factor);
  const existing = units[unit];
  if (existing && !existing.eq(bigFactor)) {
    throw new Error(
      `'${unit}' already exists with a different conversion factor`,
    );
  }

  units[unit] = bigFactor;
};

const predefinedUnits = convert.units();
convert.removeUnit = function removeUnit(unit: string) {
  if (predefinedUnits.includes(unit)) {
    throw new Error(`'${unit}' is predefined and cannot be removed`);
  }

  delete units[unit];
};

export default convert;
