import parseWWWAuthenticateHeader from './parseWWWAuthenticateHeader';

describe('parseWWWAuthenticateHeader', () => {
  const validMacaroon = 'AgELZmV3c2F0cy5jb20CQgAA6FSkojKbwJ6qdEB3KYDsKj2OBRiXVELOLm4XQpoW8tuhd7LTcvCnr+rTu9xMzpuXImQrcEYj+Rt7P4S25nPCRQACLGZpbGVfaWQ9MmU1NGFjMjktNTk0NS00YjVmLTkzZGItOTk4YTUzNWE1YTQ5AAIfZXhwaXJlc19hdD0yMDI0LTA4LTE4VDEwOjAyOjEwWgAABiAWt9xWI0jPRpmhQ8a7YwAAooHqVzmzzy1L8JZejSSJCA==';
  const validInvoice = 'lnbc160n1pnf5wdzpp5ap22fg3jn0qfa2n5gpmjnq8v9g7cupgcja2y9n3wdct59xsk7tdsdq024f5kgzgda6hxegcqzzsxqyz5vqsp5jgn62tetpsmktvs2ypsps3jvztuc7ky0m6fmd0c0ezr7u9fqxxps9qxpqysgq6ka2a8xxydkvfuu2qetwhxzglklraeressfkm8fym8rcvtvez7s98vjwflm6lcjtsra9t5hpj8zu36604kdayxjxh9djgxa8yey9twqq7yw25z';

  test('parses valid L402 header', () => {
    const input = `L402 macaroon="${validMacaroon}", invoice="${validInvoice}"`;
    expect(parseWWWAuthenticateHeader(input)).toEqual({ macaroon: validMacaroon, invoice: validInvoice });
  });

  test('throws error for empty input', () => {
    expect(() => parseWWWAuthenticateHeader('')).toThrow('No WWW-Authenticate header found');
  });

  test('throws error for missing macaroon', () => {
    const input = `L402 invoice="${validInvoice}"`;
    expect(() => parseWWWAuthenticateHeader(input)).toThrow('Missing macaroon or invoice in the header');
  });

  test('throws error for missing invoice', () => {
    const input = `L402 macaroon="${validMacaroon}"`;
    expect(() => parseWWWAuthenticateHeader(input)).toThrow('Missing macaroon or invoice in the header');
  });

  test('parses header without L402 prefix', () => {
    const input = `macaroon="${validMacaroon}" invoice="${validInvoice}"`;
    expect(parseWWWAuthenticateHeader(input)).toEqual({ macaroon: validMacaroon, invoice: validInvoice });
  });
});