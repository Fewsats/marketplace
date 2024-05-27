export interface FileObject {
  external_id: string;
  name: string;
  description: string;
  price_in_usd_cents: number;
  created_at: number;
  tags?: string[];
  cover?: string;
  file?: string;
}

export interface StorageState {
  data: {
    files: FileObject[];
  } | null;
  error: string | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed' | 'loading';
}

export interface ApplicationState {
  loader: boolean;
}
