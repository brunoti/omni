export const getOwnGetterNames = (object) => {
  const descriptors = Object.getOwnPropertyDescriptors(object);

  return Object.entries(descriptors)
    .filter(([_, descriptor]) => descriptor.hasOwnProperty("get"))
    .map(([key]) => key);
};
