import { IClientContainer } from "./container";

export class BaseContext {
	protected di: IClientContainer;
	constructor(di: IClientContainer) {
		this.di = di;
	}
}
