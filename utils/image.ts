export const b64ImgToBitMap = async (b64img: string): Promise<ImageBitmap> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const bmp = canvas.transferToImageBitmap();
      resolve(bmp);
    };
    img.src = b64img;
  });
};

export const getImgSrcFromFile = async (file: File): Promise<string> => {
  if (!FileReader)
    throw new Error(
      "FileReader missing. You may be using an outdated browser."
    );

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = (e) => {
        if (!img.naturalHeight || !img.naturalWidth) reject(e);
        resolve(reader.result as string);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};
