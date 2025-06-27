/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  MouseEvent,
} from "react";
import get from "lodash/get";
import { useAcl } from "@/client/hooks/useAcl";
import { useTranslation } from "react-i18next";
import { clickOutSideTheBlock } from "@/client/utils/random";
import { ActionMenuItem } from "./ActionMenuItem";
import { FaCog, FaDots } from "@/components/FaIcons/icons";
import { IMenu, IMenuData } from "@/client/types";

interface IActionMenuProps {
  data: any;
  menu?: IMenu;
  item?: any;
}
export default function ActionMenu(props: IActionMenuProps) {
  const { data, menu, item } = props;
  const { t } = useTranslation();
  const { allow } = useAcl();

  const ACTION_MENU_ID = useMemo(() => `ActionMenu_${get(data, "id")}`, [data]);

  const [isOpen, setIsOpen] = useState(false);

  const RenderMenuItems = useMemo(() => {
    return (
      menu &&
      Object.keys(menu)
        .filter((key: string) => {
          const i: IMenuData = menu[key];
          const isAllowed = allow(i.grant, key);
          /* FOR TEST TEMPORARY RETURN NOT ALLOWED */
          return !isAllowed;
        })
        .map((key: string, i: number) => {
          const menuItem: IMenuData = menu[key];
          menuItem["index"] = i;
          return (
            <ActionMenuItem
              setOpen={setIsOpen}
              menuItem={menuItem}
              item={item}
              key={key}
            />
          );
        })
    );
  }, [allow, menu, item, setIsOpen]);

  const windowClickActionMenu = useCallback(
    (event: any) => {
      isOpen &&
        !clickOutSideTheBlock(event, ACTION_MENU_ID) &&
        setIsOpen(false);
    },
    [ACTION_MENU_ID, isOpen]
  );

  useEffect(() => {
    window.addEventListener("click", windowClickActionMenu);

    return () => {
      window.removeEventListener("click", windowClickActionMenu);
    };
  }, [windowClickActionMenu]);

  const menuClickHandler = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  return (
    <div
      id={ACTION_MENU_ID}
      className="relative flex items-center justify-center pr-6 rounded-r-[0.625rem]"
    >
      <button
        className="table-icon w-5 h-5 text-gray-200 hover:bg-gray-400"
        type="button"
        onClick={menuClickHandler}
      >
        <FaDots className="w-[0.875rem] h-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 min-h-[2.5rem] min-w-[6.875rem] rounded-[0.625rem] p-[0.625rem] z-50 dropdown-shadows bg-white">
          <ul className="space-y-[0.3125rem]">{RenderMenuItems}</ul>
        </div>
      )}
    </div>
  );
}
