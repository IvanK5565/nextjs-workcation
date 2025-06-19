import { IEntityContainer } from "../entities";
import { useContainerContext } from "../ContainerContext";

export function useEntity<T extends keyof IEntityContainer>(
  entityName: T
): IEntityContainer[T] {
  const di = useContainerContext();
  return di.resolve(entityName);
}