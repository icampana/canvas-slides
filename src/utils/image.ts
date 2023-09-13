export type ResizedImage = {
  image: HTMLImageElement;
  ratio: number;
  width: number;
  height: number;
}

/**
 * Loads an image from the specified URL.
 *
 * @param {string} url - The URL of the image to be loaded.
 * @return {Promise<HTMLImageElement>} A promise that resolves with the loaded image.
 */
export const loader = (url: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.src = url;
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  })
}

/**
 * Resizes an image to fit within specified maximum dimensions.
 *
 * @param {HTMLImageElement} image - The image to be resized.
 * @param {number} MaxWidth - The maximum width of the resized image.
 * @param {number} MaxHeight - The maximum height of the resized image.
 * @return {ResizedImage} The resized image object.
 */
export const resizeImage = (image: HTMLImageElement, MaxWidth: number, MaxHeight: number): ResizedImage => {
  const ratio = image.naturalWidth/image.naturalHeight;
  const newHeight = Math.min(MaxHeight, MaxWidth / ratio);
  const newWidth =  Math.round( Math.min(MaxWidth, MaxHeight * ratio) );

  return {
    image,
    ratio,
    width: newWidth,
    height: newHeight,
  }
}
