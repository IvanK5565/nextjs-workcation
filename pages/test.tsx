/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClassAction } from "@/client/entities/ClassEntity";
import { SubjectAction } from "@/client/entities/SubjectEntity";
import { UserAction } from "@/client/entities/UserEntity";
import { useActions } from "@/client/hooks";
import { deleteEntities } from "@/client/store/actions";
import { AppState } from "@/client/store/ReduxStore";
import {
	classesSelector,
	subjectsSelector,
	usersSelector,
} from "@/client/store/selectors";
import { Entities, IClass, IUser } from "@/client/store/types";
import NoData from "@/components/NoData";
import { UserForm } from "@/components/ui/userForm";
import { Response } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Home() {
	// toast.warn("Page updated");
	const {saveUser} = useActions('UserEntity');
	return (
		<div className="flex flex-col w-full h-full items-start bg-gray-200 antialiased">
			<div className="w-full">
				<div className="flex flex-col space-y-2 bg-gray-200 border border-gray-300 p-4 rounded-lg shadow-md">
					<GetAllButton entity="users" />
					<GetAllButton entity="classes" />
					<GetAllButton entity="subjects" />
				</div>
				<div className="mt-4 flex flex-col space-y-2 bg-gray-200 border border-gray-300 p-4 rounded-lg shadow-md">
					<GetByIdButton entity="users" />
					<GetByIdButton entity="classes" />
					<GetByIdButton entity="subjects" />
				</div>
			</div>
			<UserCard />
			<ClassCard />
			<UserForm onSubmit={saveUser} className="p-5"/>
		</div>
	);
}

function Button({
	action,
	children,
}: {
	action: () => void;
	children: React.ReactNode;
}) {
	const NavButtonStyle =
		"block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full xl:my-2";

	return (
		<button
			className={NavButtonStyle}
			onClick={action}
		>
			{children}
		</button>
	);
}

function GetAllButton({ entity }: { entity: keyof Entities }) {
	const { getAllUsers } = useActions("UserEntity");
	const { getAllClasses } = useActions("ClassEntity");
	const { getAllSubjects } = useActions("SubjectEntity");
	const actions = {
		["users"]: getAllUsers,
		["classes"]: getAllClasses,
		["subjects"]: getAllSubjects,
	};
	const baseUrl = `/api/${entity}`;
	return <Button action={() => actions[entity]()}>{baseUrl}</Button>;
}
function GetByIdButton({ entity }: { entity: keyof Entities }) {
	const baseUrl = `/api/${entity}`;
	const [numberKey, setNumberKey] = useState<string>("1");
	const { getUserById } = useActions("UserEntity");
	const { getClassById } = useActions("ClassEntity");
	const { getSubjectById } = useActions("SubjectEntity");
	const actions = {
		["users"]: getUserById,
		["classes"]: getClassById,
		["subjects"]: getSubjectById,
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key >= "0" && e.key <= "9") {
				setNumberKey(e.key);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return (
		<Button action={() => actions[entity]({ id: numberKey })}>
			{baseUrl}/{numberKey}
		</Button>
	);
}

function UserCard() {
	const users = useSelector(usersSelector);
	console.warn("UserCard updated");
	if (Object.keys(users).length < 1) {
		return <NoData />;
	}

	return <DataCard collection="users" data={Object.entries(users)[0][1]} />;
}

function ClassCard() {
	const classes = useSelector(classesSelector);

	// if (Object.keys(classes).length < 1) {
	// 	return <div className="relative">
	// 		<div className="h-100 w-100"><NoData /></div>
	// 		<div className="absolute bottom-0"><SubjectCard /></div>
	// 	</div>
	// }
	console.warn("ClassCard updated");
	return (
		<DataCard collection="classes" data={Object.entries(classes)[0][1]}>
			<SubjectCard />
		</DataCard>
	);
}

function SubjectCard() {
	const subjects = useSelector(subjectsSelector);

	if (Object.keys(subjects).length < 1) {
		return <NoData />;
	}

	console.warn("SubjectCard updated");
	return (
		<DataCard collection="subjects" data={Object.entries(subjects)[0][1]} />
	);
}

const buttonStyle =
	"block xl:w-32 sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block";

const Null = () => <span className="text-gray-400 italic">null</span>;

function DataCard({
	data,
	collection,
	children,
}: {
	data: (object & { id: number }) | null;
	collection: keyof Entities;
	children?: React.ReactNode;
}) {
	const { deleteUser } = useActions("UserEntity");
	const { deleteClass } = useActions("ClassEntity");
	const { deleteSubject } = useActions("SubjectEntity");
	const actions = {
		users: deleteUser,
		classes: deleteClass,
		subjects: deleteSubject,
	};
	return data == null ? (
		<Null />
	) : (
		<div className="bg-white shadow rounded-md p-4 border border-gray-200">
			{Object.entries(data).map(([key, value]) => (
				<div key={key} className="flex gap-x-2 space-y-1 text-gray-700">
					<div className="w-32 font-semibold">{key}:</div>
					<div>{value === null ? <Null /> : String(value)}</div>
				</div>
			))}
			<button
				className={buttonStyle}
				onClick={() => actions[collection](data)}
			>
				Delete
			</button>
			{children}
		</div>
	);
}
