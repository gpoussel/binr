export abstract class Node {
  private _type: string;

  protected constructor(type: string) {
    this._type = type;
  }

  public get type(): string {
    return this._type;
  }
}
