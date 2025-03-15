
let idToken: number = 1;

export class IdTools {
  static generateId(): number
  {
    return idToken++;
  }
}