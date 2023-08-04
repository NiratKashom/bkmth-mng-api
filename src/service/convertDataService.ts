export const convertSnakeCaseToCamelCase = (arr: any[]): any[] => {
  return arr.map((obj) => {
    const camelCaseObj: any = {};
    for (const snakeCaseKey in obj) {
      if (snakeCaseKey.includes("_")) {
        const camelCaseKey = snakeCaseKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = obj[snakeCaseKey];
      } else {
        camelCaseObj[snakeCaseKey] = obj[snakeCaseKey];
      }
    }
    return camelCaseObj;
  });
};

export const convertCamelCaseToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertCamelCaseToSnakeCase(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const convertedObj: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        convertedObj[snakeCaseKey] = convertCamelCaseToSnakeCase(obj[key]);
      }
    }

    return convertedObj;
  }

  return obj;
}