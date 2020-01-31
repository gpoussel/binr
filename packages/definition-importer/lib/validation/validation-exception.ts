export class ValidationException extends Error {
  public constructor(public message: string) {
    super();
  }
}
