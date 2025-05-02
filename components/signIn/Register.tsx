import { useState } from "react";
import Button from "../ui/button";
import type { Response } from "@/types";

export default function Register({
	className,
	onLogin,
}: {
	className?: string;
	onLogin: () => void;
}) {
	const [formData, setFormData] = useState({
		last_name: "",
		first_name: "",
		email: "",
		password: "",
		role: "",
		status: "active",
	});
	function handleChange<T>(e: React.FormEvent<T>) {
		const { name, value } = e.target as HTMLInputElement;

		setFormData({ ...formData, [name]: value });
	}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = await fetch("/api/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		const data = (await res.json()) as Response;
		if (data && data.success) {
			alert("Registered! " + JSON.stringify(data.data, null, 2));
		} else if (data) {
			alert("Error! " + JSON.stringify(data, null, 2));
		}
	};
	return (
		<div className={className ? className : ""}>
			<h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
				Create your account.
			</h1>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<TextInput
					type="text"
					name="first_name"
					placeholder="John"
					onChange={handleChange}
				>
					First Name
				</TextInput>
				<TextInput
					type="text"
					name="last_name"
					placeholder="Doe"
					onChange={handleChange}
				>
					Last Name
				</TextInput>
				<TextInput
					type="text"
					name="email"
					placeholder="example@email.com"
					onChange={handleChange}
				>
					Email
				</TextInput>
				<TextInput
					type="password"
					name="password"
					placeholder="Password"
					onChange={handleChange}
				>
					Password
				</TextInput>
				<RoleSelect onChange={handleChange} />
				<input
					className="rounded-lg"
					type="text"
					name="status"
					id="status"
					defaultValue="active"
					hidden={true}
				/>
				<span
					onClick={() => {
						onLogin();
					}}
					className="mt-2 text-indigo-500 underline text-sm cursor-pointer h-min"
				>
					Already have an account?
				</span>

				<div className="flex flex-row-reverse justify-between">
					<Button type="submit">Confirm</Button>
				</div>
			</form>
		</div>
	);
}

function TextInput({
	children,
	type,
	name,
	placeholder,
	onChange,
}: {
	children: string;
	type: string;
	name: string;
	placeholder: string;
	onChange: <T>(e: React.FormEvent<T>) => void;
}) {
	return (
		<>
			<label
				htmlFor={name}
				className="mt-4 text-2xl text-indigo-500 font-bold leading-tight"
			>
				{children}
			</label>
			<input
				className="rounded-lg"
				type={type}
				name={name}
				id={name}
				placeholder={placeholder}
				onChange={onChange}
				required={true}
			/>
		</>
	);
}

function RoleSelect({
	onChange,
}: {
	onChange: <T>(e: React.FormEvent<T>) => void;
}) {
	return (
		<>
			<label className="mt-4 text-2xl text-indigo-500 font-bold leading-tight">
				Price Range
			</label>
			<select
				className="rounded-lg"
				name="role"
				onChange={onChange}
				required={true}
			>
				<option value="">Select Role</option>
				<option value="admin">Admin</option>
				<option value="teacher">Teacher</option>
				<option value="student">Student</option>
			</select>
		</>
	);
}
