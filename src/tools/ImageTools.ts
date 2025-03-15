
export class ImageTools {
  static asImage(anImage: HTMLImageElement): typeof Image {
    return anImage as unknown as typeof Image;
  }
}