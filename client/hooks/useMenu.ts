import { IMenu } from "../types";
import { useAcl } from "./useAcl";

export function useMenu(menu: IMenu, strict?: boolean): IMenu {
  const { allow } = useAcl();
  return Object.fromEntries(Object.entries(menu).filter(([key, value]) => (value.grant ? allow(value.grant, key) : !strict)))
}