import IContextContainer from "./IContextContainer";

export default class BaseContext  {
  protected di: IContextContainer;

  constructor(opts: IContextContainer) {
    this.di = opts;
  }
}
