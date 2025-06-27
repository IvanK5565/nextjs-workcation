import { IMenuData } from "@/acl/types";
import { useCallback, useMemo } from "react";

interface MultiSelectActionItemProps {
  className?: string;
  menuItem: IMenuData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touched?: any[];
}

export default function MultiSelectActionItem({
  menuItem,
  touched,
}: MultiSelectActionItemProps) {
  const actionMenuItemClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      menuItem.onClick?.(touched);
    },
    [menuItem, touched]
  );

  const icon = useMemo(() => menuItem.icon, [menuItem.icon]);
  const label = useMemo(() => menuItem.label, [menuItem.label]);

  const onActionMenuItemBlur = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // @ts-expect-error: focusLosted is a custom property added to the event object
      e["focusLosted"] = menuItem["index"];
    },
    [menuItem]
  );

  return (
    <li>
      <button
        onBlur={onActionMenuItemBlur}
        onClick={actionMenuItemClickHandler}
        className={`${menuItem?.className}`}
      >
        {icon && icon}

        {label && (
          <p className="text-[0.75rem] leading-4 font-normal font-nunito">
            {label}
          </p>
        )}
      </button>
    </li>
  );
}
