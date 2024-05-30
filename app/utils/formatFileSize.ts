export default function formatFileSize(sizeInBytes: number): string {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (sizeInBytes < mb) {
    return (sizeInBytes / kb).toFixed(0) + ' KB';
  } else if (sizeInBytes < gb) {
    return (sizeInBytes / mb).toFixed(0) + ' MB';
  } else {
    return (sizeInBytes / gb).toFixed(2) + ' GB';
  }
}
