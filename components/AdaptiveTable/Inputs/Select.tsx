import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IOptions } from "@/client/pagination/IPagerParams";
import { FaDropdownChevron } from "../../FaIcons/icons";

interface ISelectProps {
  name: string;
  className?: string;
  value?: string;
  items: IOptions[];
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (name: string, value: any) => void;
  chevronClassName?: string;
  chevronContainerClassName?: string;
  needPlaceholder?: boolean;
  additionalText?: string;
}

export default function Select(props: ISelectProps) {
  const {
    value,
    items,
    name,
    onChange,
    className,
    placeholder,
    chevronClassName = "",
    chevronContainerClassName = "",
    needPlaceholder = true,
    additionalText = "",
  } = props;
  const [selectedOption, setSelected] = useState<string | number | boolean>(value);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (value: string | number | boolean) => {
      setSelected(value);
      onChange(name, value);
      setIsOpen(false);
    },
    [name, onChange]
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full min-w-[150px] relative" ref={dropdownRef}>
      <div
        className={`relative ${className} ${
          selectedOption ? "text-[#2A3646]" : "!text-[#2A364650] font-[600]"
        } cursor-pointer`}
        onClick={toggleDropdown}
      >
        <div className="text-nowrap">
          <span className="font-semibold">{additionalText}</span>
          {selectedOption
            ? i18n.exists(selectedOption?.toString?.())
              ? t(selectedOption?.toString?.())
              : selectedOption
            : i18n.exists(placeholder)
            ? t(placeholder)
            : needPlaceholder
            ? t("select-an-option")
            : ""}
        </div>
        <div
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${chevronContainerClassName}`}
        >
          <FaDropdownChevron className={`w-4 h-4 ${chevronClassName}`} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full flex flex-col items-start bg-white border border-gray-200 rounded-md max-h-[220px] overflow-y-auto shadow-lg z-10">
          {needPlaceholder && (
            <button
              type="button"
              key={-1}
              className={
                "w-full p-2 text-[1rem] text-left leading-6 text-[#2A364650] font-[600] lg:text-[0.75rem] lg:leading-[1.125rem] hover:bg-[#F1F1F1]"
              }
              onClick={() => handleChange("")}
            >
              {t("select-an-option")}
            </button>
          )}
          {items.map((item) => (
            <button
              type="button"
              key={item.value?.toString()}
              className={`w-full p-2 text-[1rem] text-left leading-6 text-primary-navy font-[600] lg:text-[0.75rem] lg:leading-[1.125rem] ${
                selectedOption === item.value
                  ? "bg-[#7E92A230]"
                  : "hover:bg-[#7E92A230]"
              }`}
              onClick={() => handleChange(item.value)}
            >
              {i18n.exists(item.label) ? t(item.label) : item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
