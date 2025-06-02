export class Node {
  private mName: string;
  public isDynamic: boolean;

  constructor(pathNode: string) {
    const name = pathNode.trim();
    this.isDynamic = name.startsWith('[') && name.endsWith(']');
    this.mName = this.isDynamic ? name.slice(1, -1) : name;
  }
  public get name(): string {
    return this.isDynamic ? '[' + this.mName + ']' : this.mName;
  }
}