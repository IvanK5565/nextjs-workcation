import clsx from "clsx"
import { MouseEventHandler } from "react"


type ButtonProps = {
  children?: React.ReactNode|string,
  type?: "button" | "submit" | "reset",
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
}

export default function Button({ children, type, className, disabled, onClick }: ButtonProps) {
  return (
    <div className={className}>
      <button
        type={type}
        className={clsx(
          { "bg-indigo-200": disabled },
          { "bg-indigo-500 cursor-pointer hover:bg-indigo-400 shadow-lg": !disabled },
          "px-5 py-3 inline-block rounded-lg text-white font-semibold tracking-wide uppercase w-full",
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children ? children : "Button"}
      </button>
    </div>
  )
}