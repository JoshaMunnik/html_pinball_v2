
export class DevTools {
  static isProduction(): boolean {
    //return false;
    return process.env.NODE_ENV === 'production';
  }

  static isDevelopment(): boolean {
    return !this.isProduction();
  }
}
