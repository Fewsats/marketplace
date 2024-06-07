export default function parseWWWAuthenticateHeader(inputString: string) {
  // Splitting the string by spaces
  const parts = inputString.split(' ');

  // Creating an object to hold only the macaroon and invoice values
  const result: { macaroon?: string; invoice?: string } = {};

  // Iterating over each part of the string
  parts.forEach((part) => {
    if (part.includes('macaroon=')) {
      result.macaroon = part.split('=')[1].replace(/"/g, '');
    } else if (part.includes('invoice=')) {
      result.invoice = part.split('=')[1].replace(/"/g, '');
    }
  });

  // Return the resulting object
  return result;
}
