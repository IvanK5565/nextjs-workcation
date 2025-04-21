import { useField } from "formik"

type InputProps = {
  placeholder?: string,
  type: string,
  name: string,
  label: string,
  id?: string,
}

export default function Input({ label, ...props }: InputProps) {
  const [field, meta] = useField(props)
  return <>
    <label htmlFor={props.name || props.id} className="mt-2 text-2xl text-indigo-500 font-bold leading-tight">{label}</label>
    <input className="rounded-lg" {...field} {...props} />
    {meta.touched && meta.error ? (
      <div className="error">{meta.error}</div>
    ) : null}
  </>
}