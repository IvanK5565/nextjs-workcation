import { IMenu } from "../types";
import { useAcl } from "./useAcl";

export function useProtectedMenu(menu: IMenu): IMenu {
  const { allow } = useAcl();
  // return Object.fromEntries(
  //   Object.entries(menu)
  //     .filter(([key, value]) => (value.grant ? allow(value.grant, key) : true))
  // );
  return filterObject(menu, (key, value) =>
    value.grant ? allow(value.grant, key) : true
  );
}
export function filterObject<T>(
  obj: Record<string, T>,
  predicate: (key: string, value: T) => boolean
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key, value))
  );
}