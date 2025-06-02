/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Converts a number to a bit set represented as an array of booleans.
 * @param num - The number to convert.
 * @param bits - Optional, the number of bits to represent the number. If not provided, it will be calculated based on the number.
 * @returns An array of booleans representing the bit set.
 * @example
 * // Convert number 5 to a bit set of booleans with 4 bits
 * numberToBitSetBoolean(5, 4); // [false, true, false, true] (5 = 0101)
 * 
 * // Convert number 5 to a bit set of booleans with default bits
 * numberToBitSetBoolean(5); // [true, false, true] (5 = 101)
 */
function numberToBitSetBoolean(num: number, bits?: number): boolean[] {
  return numberToBitSet(num, bit=>bit===1, bits);
}

/**
 * Converts a number to a bit set represented as an array of integers (0 or 1).
 * @param num - The number to convert.
 * @param bits - Optional, the number of bits to represent the number. If not provided, it will be calculated based on the number.
 * @returns An array of integers (0 or 1) representing the bit set.
 * @example
 * // Convert number 5 to a bit set of integers with 4 bits
 * numberToBitSetInteger(5, 4); // [0, 1, 0, 1] (5 = 0101)
 * 
 * // Convert number 5 to a bit set of integers with default bits
 * numberToBitSetInteger(5); // [1, 0, 1] (5 = 101)
 */
function numberToBitSetInteger(num: number, bits?: number): number[] {
    return numberToBitSet(num, bit=>bit, bits)
}


/**
 * Converts a number to a bit set represented as an array of T.
 * @param num - The number to convert.
 * @param transform - A function to transform each bit (0 or 1) into type T.
 * @param bits - Optional, the number of bits to represent the number. If not provided, it will be calculated based on the number.
 * @returns An array of type T representing the bit set.
 * @example
 * // Convert number 5 to a bit set of integers with 4 bits
 * numberToBitSet(5, bit => bit, 4); // [false, true, false, true] (5 = 101)
 * 
 * // Convert number 5 to a bit set of booleans with 4 bits
 * numberToBitSet(5, bit => bit); // [false, true, false, true] (5 = 0101)
 */
function numberToBitSet<T>(num: number, transform:(bit:number)=>T, bits?: number): T[] {
  // If bits not provided, determine the minimum bits needed to represent the number
  const minBits = num === 0 ? 1 : Math.floor(Math.log2(num)) + 1;
  const bitCount = bits ?? minBits;

  const bitSet: T[] = [];
  for (let i = bitCount - 1; i >= 0; i--) {
    const bit = (num >> i) & 1;
    bitSet.push(transform(bit));
  }
  return bitSet;
}