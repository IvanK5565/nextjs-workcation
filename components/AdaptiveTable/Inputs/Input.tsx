/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// import './_inputs.scss';
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  // useRef,
  KeyboardEvent,
  useRef,
} from "react";
import {
  FaSpinner,
  FaEnvelope,
  FaSearchLight,
  FaPen,
  FaXmark,
  FaExclamationCircle,
} from "@/components/FaIcons/icons";
import { InputIcon } from "@/client/pagination/IPagerParams";
import { useTranslation } from "react-i18next";
import { isNumber } from "@/client/utils/random";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SEARCH_LENGTH } from "@/client/constants";



interface IInputProps {
  className?: string;
  name: string;
  value?: string;
  focus?: boolean;
  icon?: InputIcon;
  placeholder: string;
  onlyNumber?: boolean;
  onChange?: (name: string, value: string) => void;
  onClick?: () => void;
  isImmediatelyChange?: boolean;
  showReset?: boolean;
  disabled?: boolean;
  iconPosition?: "left" | "right";
  iconClassName?: string;
  errorMessage?: string;
  minLength?: number;
}

export default function Input(props: IInputProps) {
  const {
    className,
    placeholder,
    focus,
    name,
    value,
    icon,
    onChange,
    onlyNumber,
    onClick,
    isImmediatelyChange = true,
    showReset,
    disabled,
    iconClassName,
    iconPosition = "left",
    errorMessage = "",
    minLength = DEFAULT_SEARCH_LENGTH,
  } = props;
  const { t } = useTranslation();

  const [textInput, setTextInput] = useState(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initValue = typeof value === "string" ? value.toString() : value;
    setInputValue(initValue);
    if (focus) {
      textInput.focus();
    }
  }, [focus, textInput, value]);

  const handleChange = useCallback(
    (e: any) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      if (isImmediatelyChange && newValue?.length >= minLength) {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
          onChange(name, newValue);
        }, DEFAULT_DEBOUNCE_TIME); 
      } else {
        if (onlyNumber) {
          if (!isNumber(newValue)) {
            setInputValue(newValue);
          }
        } else {
          setInputValue(newValue);
        }
      }
    },
    [name, onChange]
  );

  const handleBlur = (e) => {
    const newInputValue = e.target.value;
    if (e.target.value.toString() !== value?.toString()) {
      onChange(name, newInputValue.toString()?.trim());
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      onChange(name, inputValue);
    }
  };

  const placeholderValue = useMemo(
    () => (placeholder ? t(placeholder) : ""),
    [placeholder, t]
  );
  useEffect(() => {
    setInputValue(value);
    if (focus) {
      textInput.focus();
    }
  }, [focus, textInput, value]);

  // const timerID = useRef(null);

  const getIcon = useMemo(() => {
    switch (icon) {
      case InputIcon.SEARCH:
        return <FaSearchLight className={`text-[#2A3646] ${iconClassName}`} />;
      case InputIcon.EMAIL:
        return <FaEnvelope className="text-base" />;
      case InputIcon.SPINNER:
        return <FaSpinner className="text-yellow-500 animate-spin" />;
      case InputIcon.EDIT:
        return <FaPen className="text-xs" />;
      default:
        return null;
    }
  }, [icon]);

  return (
    <div className="relative">
      {getIcon && (
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 ${
            iconPosition === "left" ? "left-4" : "right-4"
          }`}
        >
          {getIcon}
        </div>
      )}

      <input
        ref={setTextInput}
        onChange={handleChange}
        onBlur={handleBlur}
        onClick={() => onClick && onClick?.()}
        onKeyUp={handleKeyUp}
        className={`placeholder:text-[#666666] placeholder:leading-5 placeholder:font-medium text-[0.75rem]
                        w-full bg-[#1A1A1A] rounded-[0.275rem] px-[0.875rem] py-[0.938rem] outline-none border border-[#262626] ${className} ${
          getIcon ? (iconPosition === "left" ? "!pl-10" : "!pr-10") : ""
        }`}
        placeholder={placeholderValue}
        value={inputValue}
        name={name}
        type="text"
        disabled={disabled}
      />
      {showReset && inputValue?.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(name, "");
          }}
          type="button"
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          <FaXmark className="text-[#2A3646] w-5 h-5" />
        </button>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {errorMessage && (
          <FaExclamationCircle
            className="h-5 w-5 text-primary-red"
            aria-hidden="true"
          />
        )}
      </div>
      {errorMessage && (
        <p
          className="absolute bottom-[-0.625rem] h-3 left-0 px-2 text-xs text-primary-red"
          id={`${name}-error`}
        >
          {t(errorMessage)}
        </p>
      )}
    </div>
  );
}
