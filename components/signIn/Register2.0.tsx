import { Response } from "@/types";
import {
	ErrorMessage,
	Field,
	Form,
	Formik,
	FormikHelpers,
	FormikProps,
	withFormik,
} from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Button from "../ui/button";
import { useAppDispatch } from "@/client/store";
import { UserAction } from "@/client/entities/UserEntity";

interface IRegisterFormValues {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	status: "active";
	role: "admin" | "teacher" | "student"|'';
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
	const dispatch = useAppDispatch()
	const handleSubmit = async (values: IRegisterFormValues, { resetForm }:FormikHelpers<IRegisterFormValues>) => {
		console.log('submit')
		dispatch<UserAction>({type:'register', payload:values})
		// const res = await fetch("/api/register", {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify(values),
		// });
		// const data = (await res.json()) as Response;
		// if (data && data.success) {
		// 	alert("Registered! " + JSON.stringify(data.data, null, 2));
		// 	resetForm();
		// } else if (data) {
		// 	alert("Error! " + JSON.stringify(data, null, 2));
		// }
	};
	return (
		<div className={className ?? ""}>
			<h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
				Create your account.
			</h1>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<Form className="flex flex-col">
					<TextInput name="firstName" placeholder="John">
						First Name
					</TextInput>
					<TextInput name="lastName" placeholder="Doe">
						Last Name
					</TextInput>
					<EmailInput name="email" placeholder="example@email.com">
						Email
					</EmailInput>
					<PasswordInput name="password" placeholder="Password">
						Password
					</PasswordInput>
					<SelectInput name="role" />
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
							Already have an account?
						</span>
					</div>
					<div className="flex flex-row-reverse justify-between">
						<Button type="submit">Confirm</Button>
					</div>
				</Form>
			</Formik>
		</div>
	);
}

const EmailInput = (props: ITypedTextInputProps) =>
	TextInput({ ...props, type: "email" });
const PasswordInput = (props: ITypedTextInputProps) =>
	TextInput({ ...props, type: "password" });

interface ITextInputProps {
	children: string;
	type?: "text" | "password" | "email";
	name: string;
	placeholder: string;
}
interface ITypedTextInputProps extends Omit<ITextInputProps, "type"> {}

function TextInput({
	children,
	type = "text",
	name,
	placeholder,
}: ITextInputProps) {
	return (
		<>
			<label
				htmlFor={name}
				className="mt-4 text-2xl text-indigo-500 font-bold leading-tight"
			>
				{children}
			</label>
			<Field
				className="rounded-lg"
				type={type}
				name={name}
				id={name}
				placeholder={placeholder}
				required={true}
			/>
			<ErrorMessage name={name} className="text-red-600" component="small" />
		</>
	);
}
function SelectInput({ name }: { name: string }) {
	return (
		<>
			<label className="mt-4 text-2xl text-indigo-500 font-bold leading-tight">
				Role
			</label>
			<Field as="select" className="rounded-lg" name={name} required={true}>
				<option value="">Select Role</option>
				<option value="admin">Admin</option>
				<option value="teacher">Teacher</option>
				<option value="student">Student</option>
			</Field>
			<ErrorMessage name={name} className="text-red-600" component="small" />
		</>
	);
}
