/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { IEntityContainer } from "../entities";
import { useEntity } from "./useEntity";
import BaseEntity from "../entities/BaseEntity";

type FirstParam<Type> = Type extends (...args: infer P) => unknown
  ? P[0]
  : undefined;

export function useActions<T extends keyof IEntityContainer>(entityName: T) {
  const dispatch = useDispatch();
  const entity = useEntity(entityName);
  const actions = entity.actions as Omit<
    IEntityContainer[T],
    keyof BaseEntity
  >;

  const dispatches: {
    [key in keyof typeof actions]: (
      data?: FirstParam<IEntityContainer[T][key]>,
    ) => any;
  } = {} as any;

  Object.keys(actions).forEach((action) => {
    dispatches[action as keyof typeof actions] = (data) => dispatch((actions as any)[action](data));
  });

  return dispatches;
}