export interface FileObject {
  external_id: string;
  name: string;
  file_name: string;
  description: string;
  price_in_cents: number;
  created_at: number;
  updated_at: number;
  size: number;
  extension: string;
  mime_type: string;
  tags: string[];
  cover_url?: string;
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

export interface Option {
  name: string;
  id: string;
}
