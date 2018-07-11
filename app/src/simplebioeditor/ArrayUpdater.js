import { _ } from 'underscore';

/**
 * Provides a "safe" way to update the array 'arr' with 'element' at 'position'.
 * @returns The updated version of 'arr', if possible/necessary.
 * @param arr An array, or perhaps null.  If null and element exists, then a new array will be returned.
 * @param element An optional value to be placed at position in the array. If element is empty, then arr is returned
 * unchanged.
 * @param position The position of the value in the array 'arr' which will be replaced with element (if element exists).
 * If that position does not exist in the array, then element will just be pushed on to the end of the array.
 */
export default function updateArray(arr, element, position) {
  let updatedArray = arr;
  // If element is undefined or null or empty string
  if (!element || _.isEmpty(element)) {
    // If there is an element at position, then delete that element at that position and return updated array.
    // Otherwise just return the array unchanged.
    if (updatedArray[position]) {
      updatedArray.splice(position, 1);
    }
    return updatedArray;
  }
  // We have an element. Make sure we have an array to add it to.
  if (!updatedArray) {
    updatedArray = [];
  }
  // If position exists, replace it with element. Otherwise just push it onto end of array.
  if (updatedArray.length > position) {
    updatedArray[position] = element;
  } else {
    updatedArray.push(element);
  }
  // Return the updated array.
  return updatedArray;
}
