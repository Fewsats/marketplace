export default function parseWWWAuthenticateHeader(inputString: string) {
  // Regular expressions to extract macaroon and invoice
  const macaroonRegex = /macaroon="([^"]+)"/;
  const invoiceRegex = /invoice="([^"]+)"/;

  // Check if the input string is empty
  if (!inputString) {
    throw new Error("No WWW-Authenticate header found");
  }

  // Extracting macaroon and invoice using regex
  const macaroonMatches = macaroonRegex.exec(inputString);
  const invoiceMatches = invoiceRegex.exec(inputString);

  // Check if both macaroon and invoice are found
  if (!macaroonMatches || !invoiceMatches) {
    throw new Error("Missing macaroon or invoice in the header");
  }

  // Extracting the values from the regex matches
  const macaroon = macaroonMatches[1];
  const invoice = invoiceMatches[1];

  // Return the resulting object
  return { macaroon, invoice };
}
