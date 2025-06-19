import React from "react";

interface CheckboxProps {
  field: { name: string };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: boolean;
  form: { errors: object };
  required?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  className?: string;
  classNameWrapper?: string;
  containerClassName?: string;
  variant?: "square" | "circle";
  icon?: React.ReactNode;
  dotClassName?: string;
}

export default function Checkbox({
  field: { name },
  value = false,
  form: { errors },
  onChange,
  label = "",
  labelClassName = "",
  classNameWrapper = "",
  className = "",
  variant = "square",
  icon,
  containerClassName = "",
  dotClassName = "",
}: CheckboxProps) {
  const shape = variant === "square" ? "rounded-[0.375rem]" : "rounded-full";
  const dotShape = variant === "square" ? "rounded-[0.125rem]" : "rounded-full";

  return (
    <fieldset>
      <div className="space-y-5">
        <div className={`relative flex items-center ${classNameWrapper}`}>
          <label
            htmlFor={name}
            className={`flex items-center cursor-pointer gap-1  ${containerClassName}`}
          >
            <div
              className={`relative flex items-center justify-center w-4 h-4`}
            >
              <input
                id={name}
                name={name}
                type="checkbox"
                className="peer hidden"
                onChange={onChange}
                checked={value}
              />
              <div
                className={`
                            bg-[#1A1A1A] border border-[#262626]
                            ${shape} transition duration-200
                            peer-hover:brightness-110 w-4 h-4
                            ${className} ${errors && errors[name] ? "border-primary-red border-2" : ""}
                        `}
              />
              <div
                className={`
                            absolute bg-blue
                            ${dotShape} opacity-0
                            peer-checked:opacity-100
                            transition-opacity duration-200 w-2 h-2 ${dotClassName}
                        `}
              />
            </div>
            {icon && <div>{icon}</div>}
            <span
              className={`text-[#999999] text-[0.625rem] leading-4 font-medium ${labelClassName}`}
            >
              {label}
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  );
}