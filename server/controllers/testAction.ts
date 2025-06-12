import { ActionProps, ActionResult } from "@/types";

type ActionBody = (props: ActionProps) => ActionResult;

type Controller = Record<string, Action>

class Action {
  private method: string = 'get';
  private uses: (() => void)[] = [];
  private schemaQuery?: object;
  private schemaBody?: object;
  private rules?: Record<string, string[]>;
  private action: ActionBody;
  public constructor(action: ActionBody) {
    this.action = action;
  }

  public get Method(){
    return this.method;
  }

  public use(middleware: () => void) {
    this.uses.push(middleware);
    return this;
  }

  public validateQuery(schema: object) {
    this.schemaQuery = schema;
    return this;
  }

  public validateBody(schema: object) {
    this.schemaBody = schema;
    return this;
  }

  public allow(role: string, grants: string[]) {
    if (this.rules?.[role]) {
      this.rules[role] = grants;
    } else {
      this.rules = { [role]: grants };
    }
    return this;
  }

  public run(props: ActionProps) {
    return this.action(props);
  }
}