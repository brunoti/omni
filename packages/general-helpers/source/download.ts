// @ts-nocheck

export function blob(name: string, blob: Blob): void;
export function blob(name: string): (blob: Blob) => void;

export function blob(name, blob) {
  const download = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.append(link);
    link.click();
  };

  if (!blob) {
    return (blob) => download(blob);
  }

  download(blob);
}
