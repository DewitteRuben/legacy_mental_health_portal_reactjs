import * as queryString from "query-string";
import { safelyStringifyJSON } from "./json";

export default (url: string, options: any = {}) => {
  // Serialize query to a query string
  let query = "";

  if (options.query) {
    query = `?${queryString.stringify(options.query)}`;
    delete options.query;
  }

  if (options.body) {
    options.headers = options.headers
      ? { ...options.headers, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
    options.body = safelyStringifyJSON(options.body);
  }

  return fetch(url + query, options).then(
    result => {
      // When result is a success response => pass json body
      if (result.ok) {
        return result.json();
      }

      // When result is a failed response => pass json body and the whole result object.
      return result.json().then(error => {
        throw {
          result,
          error
        };
      });
    },
    error => {
      throw error;
    }
  );
};
