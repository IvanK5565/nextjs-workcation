import { ErrorMessage, FieldProps } from "formik";

type TextInputProps = FieldProps & { label: string; placeholder?: string, type:'text'|'email'|'password' };
export const TextInput: React.FC<TextInputProps> = ({
  field,
	label,
	placeholder,
	type
}) => (
	<div className="flex flex-col">
		<label
			htmlFor={field.name}
			className="mt-2 text-2xl text-indigo-500 font-bold leading-tight"
		>
			{label}
		</label>
		<input
			className="rounded-lg m-1"
			{...field}
			placeholder={placeholder}
      type={type??'text'}
		/>
		<ErrorMessage name={field.name} component="div" className="text-red-500" />
	</div>
);
