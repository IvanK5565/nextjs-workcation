import { ErrorMessage, FieldProps } from "formik";

type SelectOptions = { value: string; label: string }[];

export function SelectInput({
	field,
	label,
	options = [],
}: FieldProps & { label: string; options: SelectOptions }) {
	return (
		<>
			<label htmlFor={field.name} className="mt-4 text-2xl text-indigo-500 font-bold leading-tight">
				{label}
			</label>
			<select className="rounded-lg" {...field} id={field.name} required={true}>
				{options.map((op) => (
					<option key={op.value} value={op.value}>
						{op.label}
					</option>
				))}
			</select>
			<ErrorMessage
				name={field.name}
				className="text-red-600"
				component="small"
			/>
		</>
	);
}