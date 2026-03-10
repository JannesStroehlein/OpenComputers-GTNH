/**
 * Performs an HTTP request and returns the response body, status code, status message, and headers.
 * @param this Unused `this` parameter to tell TSTL to not add an implicit `self` parameter to the function.
 * @param url The URL to which the request is sent.
 * @param bodyString The string to send as the request body.
 * @param headersTable A table of headers to include in the request, where keys are header names and values are header values.
 * @param method The HTTP method to use for the request (e.g., "GET", "POST", "PUT", etc.).
 * @returns A tuple containing the response body as a string, the HTTP status code as a number, the status message as a string, and a table of response headers.
 */
export declare function fetch(
  this: void,
  url: string,
  bodyString: string,
  headersTable: Record<string, string>,
  method: string,
): [string, number, string, Record<string, string>];
