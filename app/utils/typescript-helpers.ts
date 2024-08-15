// Defines a type that represents the values of an object T.
// very useful for enums
export type ObjectValues<T> = T[keyof T]

/**
 * Safely assigns a value to a key on a target object, with an optional null check.
 * @param target The target object to which the value will be assigned.
 * @param key The key on the target object.
 * @param value The value to be assigned to the key on the target object.
 */
export const safelyAssignValue = <
	TargetType extends object,
	KeyType extends keyof TargetType,
>(
	target: TargetType,
	key: KeyType,
	value: TargetType[KeyType] | null,
): void => {
	if (value !== null) {
		// As TypeScript cannot infer that `value` is not null inside this block,
		// we assert it as `TargetType[KeyType]`.
		target[key] = value as TargetType[KeyType]
	}
}

// Helper function to safely update properties
export function updateProperty<T, K extends keyof T>(
	obj: T,
	key: K,
	value: T[K],
) {
	obj[key] = value
}

// Utility type to extract all the string values from a nested object
export type ExtractStringValues<T> = T extends object
	? { [K in keyof T]: ExtractStringValues<T[K]> }[keyof T]
	: T

/**
 * Initializes a record object where each key is a value from the provided enum,
 * and each value is an empty array of type T.
 * This function is useful for grouping attributes by enum values.
 *
 * @param enumObj An enum-like object where keys are strings and values are either strings or numbers.
 * @returns A record object with keys as enum values and values as empty arrays of type T.
 */
// how to use example:
// const createdDesignTypeMap = initializeEnumItemsMap<
//   typeof DesignTypeEnum,
//   IDesign
// >(DesignTypeEnum)
// returns: {
//   palette: [], <= IDesign[]
//   size: [],
//   fill: [],
//   ...
// }
export const initializeEnumItemsMap = <
	E extends Record<string, string | number>,
	T,
>(
	enumObj: E,
): Record<ObjectValues<E>, T[]> => {
	// Define the type for the enum values
	type EnumValue = ObjectValues<E>

	// Define the type for the map
	type EnumItemsMap = Record<EnumValue, T[]>

	// Initialize the map with the defined type
	const itemsMap: EnumItemsMap = {} as EnumItemsMap

	// Iterate over the enum values and initialize the map with empty arrays
	const enumValues = Object.values(enumObj)
	enumValues.forEach((value) => {
		itemsMap[value as EnumValue] = []
	})

	return itemsMap
}
