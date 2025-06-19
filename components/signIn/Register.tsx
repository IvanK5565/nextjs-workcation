import {
	Field,
	Form,
	Formik,
	FormikHelpers,
} from "formik";
import * as Yup from "yup";
import Button from "../ui/button";
import { useActions } from "@/client/hooks/useActions";
import { TextInput } from "../ui/textInput";
import { toast } from "react-toastify";
import { SelectInput } from "../ui/selectInput";
import { useTranslation } from "next-i18next";

interface IRegisterFormValues {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	status: "active";
	role: "admin" | "teacher" | "student" | "";
}

const validationSchema = Yup.object({
	firstName: Yup.string().required("Required"),
	lastName: Yup.string().required("Required"),
	email: Yup.string().email("Invalid email address").required("Required"),
	password: Yup.string()
		.max(20, "Must be 20 characters or less")
		.min(4, "Must be 4 characters or more")
		.required("Required"),
	role: Yup.string().oneOf(["admin", "teacher", "student"], "Required"),
	status: Yup.string().equals(["active"]),
});

const initialValues: IRegisterFormValues = {
	lastName: "",
	firstName: "",
	email: "",
	password: "",
	status: "active",
	role: "",
};

export default function Register({
	className,
	onLogin,
}: {
	className?: string;
	onLogin: () => void;
}) {
	const {t} = useTranslation();
	const { register } = useActions("UserEntity");
	// const dispatch = useAppDispatch()
	const handleSubmit = async (
		values: IRegisterFormValues,
		{ resetForm }: FormikHelpers<IRegisterFormValues>
	) => {
		console.log("submit");
		toast(JSON.stringify(values))
		register(values);
		resetForm();
	};
	return (
		<div className={className ?? ""}>
			<h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
				{t('register-title')}
			</h1>
			<Formik<IRegisterFormValues>
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<Form className="flex flex-col">
					<Field
						component={TextInput}
						name="firstName"
						placeholder="John"
						label="First Name"
						type="text"
					/>
					<Field
						component={TextInput}
						name="lastName"
						placeholder="Doe"
						label="Last Name"
						type="text"
					/>
					<Field
						component={TextInput}
						name="email"
						placeholder="example@email.com"
						label="Email"
						type="email"
					/>
					<Field
						component={TextInput}
						name="password"
						placeholder="********"
						label="Password"
						type="password"
					/>
					<Field
						component={SelectInput}
						name="role"
						options={[
							{ value: "", label: "Select Role" },
							{ value: "admin", label: "Admin" },
							{ value: "teacher", label: "Teacher" },
							{ value: "student", label: "Student" },
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
					<div>
						<span
							onClick={() => {
								onLogin();
							}}
							className="mt-2 text-indigo-500 underline text-sm cursor-pointer h-min"
						>
							{t('haveAccount')}
						</span>
					</div>
					<div className="flex flex-row-reverse justify-between">
						<Button type="submit">{t('confirm')}</Button>
					</div>
				</Form>
			</Formik>
		</div>
	);
}
