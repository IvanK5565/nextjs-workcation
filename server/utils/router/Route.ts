import { Node } from "./Node";

export class Route {
  private readonly nodes: Node[] = [];
  constructor(route: string) {
    route = route.trim();
    this.nodes = route.trim().split('/')
      .filter(node => node.length > 0) // Filter out empty nodes
      .map(node => new Node(node)); // Create Node instances for each valid path segment
  }
  public toString(): string {
    return '/' + this.nodes.map(node => node.name).join('/');
  }
  
  public isPathMatch(path: string): boolean {
    const pathNodes = path.trim().split('/')
      .filter(node => node.length > 0); // Filter out empty nodes
    if (pathNodes.length !== this.nodes.length) {
      return false; // Length mismatch
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (!node.isDynamic && node.name !== pathNodes[i]) {
        return false; // Static node mismatch
      }
    }
    return true; // All nodes match
  }

  public getDynamicValues(path: string): Record<string, string> | null {
    if (!this.isPathMatch(path)) {
      return {};
    }
    const pathNodes = path.trim().split('/')
      .filter(node => node.length > 0);
    const dynamicValues: Record<string, string> = {};
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (node.isDynamic) {
        dynamicValues[node.name.slice(1, -1)] = pathNodes[i]; // Extract dynamic value
      } else if (node.name !== pathNodes[i]) {
        return {};
      }
    }
    return dynamicValues; // Return collected dynamic values
  }
}