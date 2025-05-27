// /utils/routes.ts
class RouteNode {
    public name: string;
    public isDynamic: boolean;
    constructor(part: string) {
        this.isDynamic = part.startsWith("[") && part.endsWith("]");
        this.name = this.isDynamic ? part.slice(1, -1) : part;
    }
    public toString(): string {
        return this.isDynamic ? `[${this.name}]` : this.name;
    };
}

export class Route {
	nodes: RouteNode[];
	constructor(route: string) {
		this.nodes = route
			.split("/")
			.filter(Boolean)
			.map((part) => new RouteNode(part));
	}
	public toString(): string {
		return "/" + this.nodes.map(node=>node.toString()).join("/");
	}
	private comparePart(part: string, node: RouteNode): boolean {
		if (node.isDynamic) return true; // Dynamic nodes match any part
		return node.name === part; // Static nodes must match exactly
	}
	public match(path: string): boolean {
		if(!path) return false;
		const pathParts = path.split("/").filter(Boolean);
		if (pathParts.length !== this.nodes.length) return false;
		return this.nodes.every((node, index) =>
			this.comparePart(pathParts[index], node)
		);
	}
	public getQueryIfMatch(path: string): Record<string, string> | null {
		const pathParts = path.split("/").filter(Boolean);
		if (!this.match(path)) return null;
		const values: Record<string, string> = {};
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			if (node.isDynamic) {
				values[node.name] = pathParts[i];
			}
		}
		return values;
	}
  public get(i:number){
    return this.nodes[i];
  }
}

export class Routes {
	public routes: Route[] = [];
	constructor(...routes: Route[]) {
		if (routes) {
			this.routes.push(...routes);
		}
	}
  public static fromStrings(...routes:string[]){
    return new this(...routes.map(r => new Route(r)))
  }
  public findRoute(path:string){
    const founded = this.routes.filter(r => r.match(path));
    if(founded.length == 0) return null;
    if(founded.length == 1) return founded[0];
    let priority:Route = founded[0];
    for(const route of founded){
      priority = this.comparePriority(priority, route);
    }
    return priority;
  }
  private comparePriority(r1:Route, r2:Route){
    if(r1.nodes.length > r2.nodes.length) return r1;
    if(r2.nodes.length > r1.nodes.length) return r2;
    for(let i = 0; i < r1.nodes.length; i++){
      const n1 = r1.get(i);
      const n2 = r2.get(i);
      if(n1.isDynamic && !n2.isDynamic) return r1;
      if(!n1.isDynamic && n2.isDynamic) return r2;
    }
    return r1;
  }
}
