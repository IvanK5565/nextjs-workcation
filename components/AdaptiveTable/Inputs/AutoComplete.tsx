/* eslint-disable react-hooks/exhaustive-deps */
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SEARCH_LENGTH } from "@/client/constants";
import { useLocalStorageQueue } from "@/client/hooks/useLocalStorageQueue";
import { IOptions, InputIcon } from "@/client/pagination/IPagerParams";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { FaXmark } from "../../FaIcons/icons";
import Input from "./Input";

interface IAutoCompleteProps {
  className?: string;
  name: string;
  value?: string;
  icon?: InputIcon;
  placeholder: string;
  options?: IOptions[];
  onChange?: (name: string, value: string) => void;
  onSearch?: (value: string) => void;
  position?: "top" | "bottom" | "left" | "right" | "bottom-right";
  debounceTime?: number;
  minSearchLength?: number;
  disabled?: boolean;
  form?: { errors: {[key:string]:string} };
  label?: string;
  labelClassName?: string;
  needSaveToLocalStorage?: boolean;
  mainContainerClassName?: string;
  isLocalSearch?: boolean;
  zIndex?: number;
}

export default function AutoComplete({
  position = "bottom",
  options,
  value,
  name,
  onChange,
  onSearch,
  placeholder,
  form,
  className,
  icon,
  debounceTime = DEFAULT_DEBOUNCE_TIME,
  minSearchLength = DEFAULT_SEARCH_LENGTH,
  disabled = false,
  label,
  labelClassName = "",
  needSaveToLocalStorage = false,
  mainContainerClassName = "",
  isLocalSearch = false,
  zIndex = 2000,
}: IAutoCompleteProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, addSearch, removeItem] = useLocalStorageQueue(name, 5);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const selectFieldRef = useRef<HTMLDivElement>(null);

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const updateDropdownPosition = useCallback(() => {
    if (selectFieldRef.current) {
      const rect = selectFieldRef.current.getBoundingClientRect();
      const dropdownPositionStyle: React.CSSProperties = {
        position: "absolute",
        width: rect.width,
      };

      switch (position) {
        case "top":
          dropdownPositionStyle.top =
            rect.top +
            window.scrollY -
            (dropdownRef.current?.offsetHeight ?? 0);
          dropdownPositionStyle.left = rect.left + window.scrollX;
          break;
        case "bottom":
          dropdownPositionStyle.top = rect.bottom + window.scrollY;
          dropdownPositionStyle.left = rect.left + window.scrollX;
          break;
        case "bottom-right":
          dropdownPositionStyle.top = rect.bottom + window.scrollY;
          dropdownPositionStyle.left = rect.left + window.scrollX - 120;
          break;
        case "left":
          dropdownPositionStyle.top = rect.top + window.scrollY;
          dropdownPositionStyle.left =
            rect.left +
            window.scrollX -
            (dropdownRef.current?.offsetWidth ?? 0);
          break;
        case "right":
          dropdownPositionStyle.top = rect.top + window.scrollY;
          dropdownPositionStyle.left = rect.right + window.scrollX;
          break;
        default:
          dropdownPositionStyle.top = rect.bottom + window.scrollY;
          dropdownPositionStyle.left = rect.left + window.scrollX;
          break;
      }

      setDropdownStyle(dropdownPositionStyle);
    }
  }, [position]);

  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
    } else {
      window.removeEventListener("resize", updateDropdownPosition);
    }

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [showDropdown, updateDropdownPosition]);

  const handleSelectItem = (selected: IOptions) => {
    onChange?.(name, selected?.value?.toString() ?? "");
    if (needSaveToLocalStorage) addSearch(selected);
    setShowDropdown(false);
  };
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearchChange = (name: string, value: string) => {
    setSearchValue(value);
    if (value === "") {
      onChange?.(name, value);
      return;
    }
    setShowDropdown(true);
    if (value.length < minSearchLength) {
      return;
    }
    if (!isLocalSearch) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        onSearch?.(value);
      }, debounceTime);
    }
  };

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      if (
        !(
          selectFieldRef.current &&
          selectFieldRef.current?.contains(target as Node)
        )
      ) {
        if (showDropdown) {
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [selectFieldRef, showDropdown]);

  useEffect(() => {
    if (value) {
      const label = options?.find((item) => item.value === value)?.label;
      if (label) {
        setSearchValue(label);
      }
    } else {
      setSearchValue("");
    }
  }, [value]);

  const handleClickInput = () => setShowDropdown(!showDropdown);

  const renderResults = () => {
    let results = [];

    let validRecentSearches = recentSearches;
    if (searchValue?.length) {
      validRecentSearches = recentSearches.filter((recent) =>
        options?.some((option) => option.value === recent.value)
      );
      const matchingRecent = validRecentSearches.filter((recent) =>
        recent.label.toLowerCase().includes(searchValue.toLowerCase())
      );

      const filteredOptions =
        options?.filter(
          (item) =>
            !matchingRecent.some((recent) => recent.value === item.value) &&
            item.label.toLowerCase().includes(searchValue.toLowerCase())
        ) || [];

      results = [...matchingRecent, ...filteredOptions];
    } else {
      results = [...validRecentSearches, ...(options || [])];
    }

    if (!results?.length) {
      return (
        <p className="font-inter text-[0.875rem] text-dark-blue leading-5 italic py-6 text-center">
          {t("no-matching-results")}
        </p>
      );
    }

    return (
      <div className="">
        {results.map((item, index) => (
          <div key={`option-select-${index}`} className="relative w-full">
            <button
              className={
                "px-4 py-2 cursor-pointer text-[0.75rem] !leading-[1rem] !font-inter !font-semibold !text-primary-navy w-full text-left hover:bg-[#33333310]"
              }
              type="button"
              onClick={() => handleSelectItem(item)}
            >
              {item?.label}
            </button>
            {validRecentSearches.some(
              (recentItem) => recentItem.value === item.value
            ) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item);
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <FaXmark className="text-[#2A3646] w-5 h-5 hover:bg-[#FC9146] hover:text-white rounded-full" />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div
      ref={selectFieldRef}
      className={`relative z-20 w-full ${mainContainerClassName}`}
    >
      {label && (
        <label
          htmlFor={name}
          className={`text-[#FFFFFF] text-[0.75rem] font-medium ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <Input
        name={name}
        className={className}
        placeholder={placeholder}
        icon={icon}
        onChange={handleSearchChange}
        onClick={handleClickInput}
        value={searchValue}
        disabled={disabled}
        isImmediatelyChange
        showReset
        errorMessage={form?.errors?.[name]}
        minLength={isLocalSearch ? 0 : minSearchLength}
      />
      {showDropdown &&
        !disabled &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={
              `mt-1 overflow-hidden bg-white border border-gray-200 rounded-md max-h-[10rem] overflow-y-auto z-[${zIndex}]`
            }
            style={dropdownStyle}
          >
            {renderResults()}
          </div>,
          document.body
        )}
    </div>
  );
}
