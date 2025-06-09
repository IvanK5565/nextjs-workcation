import { ErrorMessage, FieldProps, useField } from "formik";

type InputProps = {
	placeholder?: string;
	type: string;
	name: string;
	label: string;
	id?: string;
};

export default function TextInput({ label, ...props }: InputProps) {
	const [field, meta] = useField(props);
	return (
		<>
			<label
				htmlFor={props.name || props.id}
				className="mt-2 text-2xl text-indigo-500 font-bold leading-tight"
			>
				{label}
			</label>
			<input className="rounded-lg" {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</>
	);
}

type TextInputProps = FieldProps & { label: string; placeholder?: string };
export const TextInput2: React.FC<TextInputProps> = ({
  field,
	label,
	placeholder,
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
      type='text'
		/>
		<ErrorMessage name={field.name} component="div" className="text-red-500" />
	</div>
);
