export const safelyStringifyJSON = (json: object) => {
  try {
    return JSON.stringify(json);
  } catch (e) {
    return null;
  }
};

export const safelyParseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
