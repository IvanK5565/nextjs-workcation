import { IUser } from "@/client/store/types";
import { UserRole, UserStatus } from "@/constants";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { TextInput2 } from "./textInput";
import Button from "./button";
import * as Yup from "yup";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getField<T>(
	name: string,
	component: React.FC<T>,
	label: string,
	placeholder?: string
): React.ReactNode {
	return (
		<Field
			name={name}
			component={component}
			label={label}
			placeholder={placeholder}
		/>
	);
}

export function UserForm({onSubmit,className}:{onSubmit?:(values:IUser)=>void,className?:string}) {
	const schema = Yup.object({
		email: Yup.string().email("Invalid email address").required("Required"),
		password: Yup.string()
			.max(20, "Must be 20 characters or less")
			.min(4, "Must be 4 characters or more")
			.required("Required"),
	});
	return (
    <div className={className}>
		<Formik<IUser>
			initialValues={{
				id: 0,
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				role: UserRole.GUEST,
				status: UserStatus.ACTIVE,
			}}
			validationSchema={schema}
			onSubmit={(values) => {
				toast.success("Form submited: " + JSON.stringify(values, null, 2));
        if(onSubmit) onSubmit(values);
			}}
		>
			<Form>
				<Field
					name="firstName"
					component={TextInput2}
					label="First Name"
					placeholder="John"
				/>
				{/* {getField('firstName', TextInput2, 'First Name', 'John')} */}

				<Field
					name="lastName"
					component={TextInput2}
					label="last Name"
					placeholder="Doe"
				/>
				<Field
					name="email"
					component={TextInput2}
					label="Email"
					placeholder="example@mail.com"
				/>
				<Field
					name="password"
					component={TextInput2}
					label="Password"
					placeholder="********"
				/>

				<Button className="m-1" type="submit">Submit</Button>
				<Button className="m-1" type="reset">Reset</Button>
			</Form>
		</Formik>
    </div>
	);
}
