import { getOwnGetterNames } from "./get-own-getter-names.js";

export const toEnumerableObject = (entity) => {
  const getters = getOwnGetterNames(Object.getPrototypeOf(entity));

  const object = {};

  for (const key of getters) {
    object[key] ||= entity[key];
  }

  return object;
};
