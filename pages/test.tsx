/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClassAction } from "@/client/entities/ClassEntity";
import { SubjectAction } from "@/client/entities/SubjectEntity";
import { UserAction } from "@/client/entities/UserEntity";
import { deleteEntities } from "@/client/store/actions";
import { AppState } from "@/client/store/ReduxStore";
import { IClass, IUser } from "@/client/store/types";
import NoData from "@/components/NoData";
import { Response } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
	// const response = useSelector<AppState, Response>(
	// 	(state) => state.latestResponse
	// );

	console.warn("Page updated");
	return (
		<div className="flex w-full h-full justify-center items-center bg-gray-200 antialiased">
			<div>
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
			{/* <ResponseHeader res={response} /> */}
			<ResponseHeader />
		</div>
	);
}

const actions: {
	[key in keyof AppState["entities"]]: [string, string, string];
} = {
	users: ["getUserById", "getAllUsers", "deleteUser"],
	classes: ["getClassById", "getAllClasses", "deleteClass"],
	subjects: ["getSubjectById", "getAllSubjects", "deleteSubject"],
};

function Button({
	action,
	children,
}: {
	action: { type: string; payload?: any };
	children: React.ReactNode;
}) {
	const dispatch = useDispatch();
	const NavButtonStyle =
		"block w-full sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-4 py-2 rounded-lg xl:block xl:w-full xl:my-2";

	return (
		<button
			className={NavButtonStyle}
			onClick={() => {
				dispatch(action);
			}}
		>
			{children}
		</button>
	);
}

function GetAllButton({ entity }: { entity: keyof AppState["entities"] }) {
	const baseUrl = `/api/${entity}`;
	return <Button action={{ type: actions[entity][1] }}>{baseUrl}</Button>;
}
function GetByIdButton({ entity }: { entity: keyof AppState["entities"] }) {
	const baseUrl = `/api/${entity}`;
	const [numberKey, setNumberKey] = useState<string>("1");

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
		<Button action={{ type: actions[entity][0], payload: { id: numberKey } }}>
			{baseUrl}/{numberKey}
		</Button>
	);
}

function UserCard() {
	const dispatch = useDispatch();
	const users = useSelector<AppState, Record<string, IUser>>(
		(state) => state.entities.users as Record<string, IUser>
	);
	console.warn("UserCard updated");
	if (Object.keys(users).length < 1) {
		dispatch<UserAction>({ type: "getAllUsers" });
		return <NoData />;
	}

	return <DataCard collection="users" data={Object.entries(users)[0][1]} />;
}

function ClassCard() {
	const dispatch = useDispatch();
	const classes = useSelector<AppState, Record<string, IClass>>(
		(state) => state.entities.classes as Record<string, IClass>
	);

	if (Object.keys(classes).length < 1) {
		dispatch<ClassAction>({ type: "getAllClasses" });
		return <NoData />;
	}
	console.warn("ClassCard updated");
	return (
		<DataCard collection="classes" data={Object.entries(classes)[0][1]}>
			<SubjectCard />
		</DataCard>
	);
}

function SubjectCard() {
	const dispatch = useDispatch();
	const subjects = useSelector<AppState, Record<string, IClass>>(
		(state) => state.entities.subjects as Record<string, IClass>
	);

	if (Object.keys(subjects).length < 1) {
		dispatch<SubjectAction>({ type: "getAllSubjects" });
		return <NoData />;
	}

	console.warn("SubjectCard updated");
	return (
		<DataCard collection="subjects" data={Object.entries(subjects)[0][1]} />
	);
}

function ResponseHeader() {
	const { code, success, type, message } = useSelector<AppState, Response>(
		(state) => state.latestResponse
	);
	return (
		<div className="max-w-md mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm text-sm text-gray-700">
			<div className="flex justify-between mb-1">
				<span className="font-medium">Code:</span>
				<span>{code}</span>
			</div>
			<div className="flex justify-between mb-1">
				<span className="font-medium">Success:</span>
				<span className={success ? "text-green-600" : "text-red-600"}>
					{success ? "True" : "False"}
				</span>
			</div>
			<div className="flex justify-between">
				<span className="font-medium">Type:</span>
				<span>{type}</span>
			</div>
			{message && (
				<div className="mt-2 text-blue-600 italic">
					<span>Message: </span>
					<span>{message}</span>
				</div>
			)}
		</div>
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
	collection: string;
	children?: React.ReactNode;
}) {
	const dispatch = useDispatch();
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
				onClick={() => {
					// dispatch(deleteEntities({ [collection]: { [data.id]: data } }));
					dispatch({ type: actions[collection][2], payload: data });
				}}
			>
				Delete
			</button>
			{children}
		</div>
	);
}
