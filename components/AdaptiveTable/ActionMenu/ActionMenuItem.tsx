import React, { useMemo, useCallback, MouseEvent, FocusEvent } from "react";
import { IMenuData } from "@/acl/types";

interface IMenuItemProps {
  className?: string;
  menuItem: IMenuData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  setOpen?: (open: boolean) => void;
}

export function ActionMenuItem(props: IMenuItemProps) {
  const { menuItem, item, setOpen } = props;

  const actionMenuItemClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      menuItem?.onClick?.(item);
      setOpen?.(false);
    },
    [item, menuItem, setOpen]
  );

  const icon = useMemo(() => menuItem.icon, [menuItem.icon]);
  const label = useMemo(() => menuItem.label, [menuItem.label]);

  const onActionMenuItemBlur = useCallback(
    (e: FocusEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      // @ts-expect-error: focusLosted is a custom property not defined on FocusEvent
      e["focusLosted"] = menuItem["index"];
    },
    [menuItem]
  );

  return (
    <li>
      <button
        onBlur={onActionMenuItemBlur}
        onClick={actionMenuItemClickHandler}
        className={`flex items-center gap-2 p-[0.625rem] w-full ${menuItem?.className}`}
      >
        {icon && icon}

        <p className="text-[0.75rem] leading-4 font-normal font-nunito">
          {label}
        </p>
      </button>
    </li>
  );
}
