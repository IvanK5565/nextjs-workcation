import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IOptions } from "@/client/pagination/IPagerParams";

export interface ICheckboxProps {
  className?: string;
  name?: string;
  checked: boolean;
  option?: IOptions;
  onChange: (id: string, checked: boolean) => void;
}

export default function Checkbox(props: ICheckboxProps) {
  const { name, checked, option, onChange, className } = props;
  const { t } = useTranslation();

  const labelText = useMemo(
    () => (option?.label ? t(option?.label) : ""),
    [option?.label, t]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.stopPropagation();
      const value: string = option?.value ? option.value.toString() : "";
      onChange(value, !checked);
    },
    [checked, onChange, option]
  );

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="flex gap-x-1 pl-6 rounded-r-[0.625rem]" onClick={handleContainerClick}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="accent-blue2 w-5 h-5"
          name={name}
          defaultChecked={checked}
          onChange={handleCheck}
        />
      </div>
      <div className="leading-6">
        {option?.label && (
          <label htmlFor="comments" className={className}>
            {labelText}
          </label>
        )}
      </div>
    </div>
  );
}
