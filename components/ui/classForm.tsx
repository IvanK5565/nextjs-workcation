import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "../ui/button";
import { useActions } from "@/client/hooks/useActions";
import { useTranslation } from "next-i18next";
import { TextInput } from "./textInput";
import { SelectInput } from "./selectInput";

interface IClassFormValues {
	title: string;
	teahcer_id: string;
	year: number;
	status: "active" | "closed" | "draft";
}

const validationSchema = Yup.object({
	title: Yup.string().required("Required"),
	teahcer_id: Yup.string().required("Required"),
	year: Yup.number()
		.max(new Date().getFullYear())
		.min(new Date().getFullYear() - 100)
		.required("Required"),
	status: Yup.string().oneOf(["active", "closed", "draft"], "Required"),
});

const initialValues: IClassFormValues = {
	title: "",
	teahcer_id: "",
	year: new Date().getFullYear(),
	status: "draft",
};

export default function ClassForm({
	className,
}: {
	className?: string;
}) {
	const { t } = useTranslation();
	const { saveClass } = useActions("ClassEntity");
	const handleSubmit = async (
		values: IClassFormValues,
		{ resetForm }: FormikHelpers<IClassFormValues>
	) => {
		console.log("submit");
		saveClass(values);
		resetForm();
	};
	return (
		<div className={className}>
			<h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
				{t("newClass-title")}
			</h1>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<Form className="flex flex-col">
					<Field
						name="title"
						placeholder="10-A"
						label={t('newClass-title-label')}
						component={TextInput}
					/>
					<Field
						name="year"
						placeholder="2025"
						label="Year"
						component={TextInput}
					/>
					<Field
						name="teacher_id"
						label="Teacher"
						component={SelectInput}
						options={[{ value: "", label: "Select Teacher" }]}
					/>
					<Field
						name="status"
						label="Status"
						component={SelectInput}
						options={[
							{ value: "active", label: "Active" },
							{ value: "closed", label: "Closed" },
							{ value: "draft", label: "Draft" },
						]}
					/>

					<input
						className="rounded-lg"
						type="text"
						name="status"
						id="status"
						defaultValue="active"
						hidden={true}
					/>
					<div className="flex flex-row-reverse justify-between">
						<Button className="mt-5" type="submit">{t("confirm")}</Button>
					</div>
				</Form>
			</Formik>
		</div>
	);
}
