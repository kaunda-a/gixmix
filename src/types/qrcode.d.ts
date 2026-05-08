declare module "qrcode" {
  interface QRCodeToDataURLOptions {
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    margin?: number;
    width?: number;
    type?: string;
  }

  function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;

  const QRCode: { toDataURL: typeof toDataURL };
  export default QRCode;
}