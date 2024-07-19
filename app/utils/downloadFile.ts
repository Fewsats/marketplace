import FileSaver from 'file-saver';
import { Invoice } from '@getalby/lightning-tools';
import parseWWWAuthenticateHeader from '@/app/utils/parseWWWAuthenticateHeader';

export async function downloadFile(fileId: string, macaroon: string, preimage: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/v0/storage/download/${fileId}`,
      {
        headers: { Authorization: `L402 ${macaroon}:${preimage}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('File download failed:', error);
    throw error;
  }
}

export async function getL402Header(fileId: string) {
  try {
    await fetch(`${process.env.API_URL}/v0/storage/download/${fileId}`);
  } catch (err: any) {
    if (
      err?.response?.status === 402 &&
      err?.response?.headers &&
      err?.response?.headers.get('WWW-Authenticate')
    ) {
      return err.response.headers.get('WWW-Authenticate');
    }
  }
  return null;
}

export function parseL402Header(l402Header: string) {
  const { macaroon, invoice } = parseWWWAuthenticateHeader(l402Header);
  let paymentHash = '';
  if (invoice) {
    const invoiceObj = new Invoice({ pr: invoice });
    paymentHash = invoiceObj?.paymentHash;
  }
  return { macaroon, invoice, paymentHash };
}