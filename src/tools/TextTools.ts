
export class TextTools {
  static formatScore(aScore: number): string {
    return Math.floor(aScore).toString().padStart(6, '0');
  }
}