import { IMenu, IMenuData } from "@/client/types";
import { useMemo } from "react";
import Button from "../ui/button";
import { useProtectedMenu } from "@/client/hooks/useProtectedMenu";
// import Button from "../Button";

interface TableActionsProps {
  tableActions?: IMenu;
}

export default function TableActions({ tableActions }: TableActionsProps) {
  tableActions = useProtectedMenu(tableActions ?? {});

  const RenderMenuItems = useMemo(() => {
    return (
      tableActions &&
      Object.keys(tableActions)
        // .filter((key: string) => {
        //   const i: IMenuData = tableActions[key];
        //   const isAllowed = allow(i.grant, key);
        //   /* FOR TEST TEMPORARY RETURN NOT ALLOWED */
        //   return !isAllowed;
        // })
        .map((key: string, i: number) => {
          const menuItem: IMenuData = tableActions[key];
          menuItem["index"] = i;
          return (
            <Button
              key={key}
              // variant="purple"
              // icon={menuItem?.icon}
              onClick={() => menuItem?.onClick && menuItem.onClick?.(menuItem)}
              // text={menuItem?.label}
              // iconPosition={menuItem?.iconPosition}
              className="!w-fit text-nowrap px-5 py-[0.625rem] rounded-[0.625rem]"
            >{menuItem?.label}</Button>
          );
        })
    );
  }, [tableActions]);
  return RenderMenuItems && <div className="absolute right-1 lg:static">{RenderMenuItems}</div>;
}
