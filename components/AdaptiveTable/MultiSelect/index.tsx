/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMenu, IMenuData } from "@/acl/types";
// import { useAcl } from "@/client/hooks/useAcl";
import { useMemo } from "react";
import MultiSelectActionItem from "./MultiSelectActionItem";
import { useProtectedMenu } from "@/client/hooks/useProtectedMenu";

interface MultiSelectActionsProps {
  multiSelectActions?: IMenu;
  selectedRows?: any[];
}

export default function MultiSelectActions({
  multiSelectActions,
  selectedRows,
}: MultiSelectActionsProps) {
  // const { allow } = useAcl();
  multiSelectActions = useProtectedMenu(multiSelectActions ?? {})

  const RenderMenuItems = useMemo(() => {
    return (
      multiSelectActions &&
      Object.keys(multiSelectActions)
        // .filter((key: string) => {
        //   const i: IMenuData = multiSelectActions[key];
        //   const isAllowed = allow(i.grant, key);
        //   /* FOR TEST TEMPORARY RETURN NOT ALLOWED */
        //   return !isAllowed;
        // })
        .map((key: string, i: number) => {
          const menuItem: IMenuData = multiSelectActions[key];
          menuItem["index"] = i;
          return (
            <MultiSelectActionItem
              menuItem={menuItem}
              touched={selectedRows}
              key={key}
            />
          );
        })
    );
  }, [multiSelectActions, selectedRows]);

  return <th className="pr-6">{RenderMenuItems && <ul>{RenderMenuItems}</ul>}</th>;
}
