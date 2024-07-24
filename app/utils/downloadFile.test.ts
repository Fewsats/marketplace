import { downloadFile, getL402Header, parseL402Header } from '@/app/utils/downloadFile';
import FileSaver from 'file-saver';
import { Invoice } from '@getalby/lightning-tools';
import parseWWWAuthenticateHeader from '@/app/utils/parseWWWAuthenticateHeader';

jest.mock('file-saver');
jest.mock('@getalby/lightning-tools');
jest.mock('@/app/utils/parseWWWAuthenticateHeader');

describe('downloadFile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should download file successfully', async () => {
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    const result = await downloadFile('file123', 'macaroon', 'preimage');
    expect(result).toEqual(mockBlob);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.API_URL}/v0/storage/download/file123`,
      {
        headers: { Authorization: 'L402 macaroon:preimage' },
      }
    );
  });

  it('should throw error when download fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(downloadFile('file123', 'macaroon', 'preimage')).rejects.toThrow('Request failed with status 404');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(downloadFile('file123', 'macaroon', 'preimage')).rejects.toThrow('Network error');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle large files', async () => {
    const largeBlob = new Blob([new ArrayBuffer(10 * 1024 * 1024)], { type: 'application/octet-stream' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(largeBlob),
    });

    const result = await downloadFile('largefile', 'macaroon', 'preimage');
    expect(result).toEqual(largeBlob);
  });

  it('should handle various HTTP status codes', async () => {
    const statusCodes = [400, 401, 403, 500];
    for (const status of statusCodes) {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status,
      });

      await expect(downloadFile('file123', 'macaroon', 'preimage')).rejects.toThrow(`Request failed with status ${status}`);
    }
  });

  it('should set correct Content-Type', async () => {
    const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    const result = await downloadFile('file123', 'macaroon', 'preimage');
    expect(result.type).toBe('application/pdf');
  });
});

describe('getL402Header', () => {
  it('should return L402 header when request fails with 402', async () => {
    const mockHeader = 'L402 header';
    const mockError = {
      response: {
        status: 402,
        headers: {
          get: jest.fn().mockReturnValue(mockHeader),
        },
      },
    };
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const result = await getL402Header('file123');
    expect(result).toBe(mockHeader);
  });

  it('should return null when request does not fail with 402', async () => {
    global.fetch = jest.fn().mockResolvedValue({});

    const result = await getL402Header('file123');
    expect(result).toBeNull();
  });

  it('should handle non-402 errors', async () => {
    const mockError = {
      response: {
        status: 500,
        headers: {
          get: jest.fn(),
        },
      },
    };
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const result = await getL402Header('file123');
    expect(result).toBeNull();
  });

  it('should handle missing WWW-Authenticate header', async () => {
    const mockError = {
      response: {
        status: 402,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      },
    };
    global.fetch = jest.fn().mockRejectedValue(mockError);

    const result = await getL402Header('file123');
    expect(result).toBeNull();
  });

  it('should handle network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await getL402Header('file123');
    expect(result).toBeNull();
  });
});

describe('parseL402Header', () => {
  it('should parse L402 header correctly', () => {
    const mockMacaroon = 'mockMacaroon';
    const mockInvoice = 'mockInvoice';
    const mockPaymentHash = 'mockPaymentHash';

    (parseWWWAuthenticateHeader as jest.Mock).mockReturnValue({
      macaroon: mockMacaroon,
      invoice: mockInvoice,
    });

    (Invoice as jest.Mock).mockImplementation(() => ({
      paymentHash: mockPaymentHash,
    }));

    const result = parseL402Header('mockL402Header');
    expect(result).toEqual({
      macaroon: mockMacaroon,
      invoice: mockInvoice,
      paymentHash: mockPaymentHash,
    });
  });

  it('should handle missing invoice', () => {
    (parseWWWAuthenticateHeader as jest.Mock).mockReturnValue({
      macaroon: 'mockMacaroon',
      invoice: undefined,
    });

    const result = parseL402Header('mockL402Header');
    expect(result).toEqual({
      macaroon: 'mockMacaroon',
      invoice: undefined,
      paymentHash: '',
    });
  });

  it('should handle missing macaroon', () => {
    (parseWWWAuthenticateHeader as jest.Mock).mockReturnValue({
      macaroon: undefined,
      invoice: 'mockInvoice',
    });

    (Invoice as jest.Mock).mockImplementation(() => ({
      paymentHash: 'mockPaymentHash',
    }));

    const result = parseL402Header('mockL402Header');
    expect(result).toEqual({
      macaroon: undefined,
      invoice: 'mockInvoice',
      paymentHash: 'mockPaymentHash',
    });
  });

  it('should handle invalid invoice format', () => {
    (parseWWWAuthenticateHeader as jest.Mock).mockReturnValue({
      macaroon: 'mockMacaroon',
      invoice: 'invalidInvoice',
    });

    (Invoice as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid invoice');
    });

    expect(() => parseL402Header('mockL402Header')).toThrow('Invalid invoice');
  });

  it('should handle unexpected header format', () => {
    (parseWWWAuthenticateHeader as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected header format');
    });

    expect(() => parseL402Header('unexpectedFormat')).toThrow('Unexpected header format');
  });
});