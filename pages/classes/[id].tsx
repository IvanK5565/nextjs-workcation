import ctx from "@/server/container/container";
import { FormEvent } from "react";
import Button from "@/components/ui/button";
import NoData from "@/components/NoData";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AccessDenied from "@/components/AccessDenied";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { entitySelector } from "@/client/store/selectors";
import { UserRole } from "@/constants";
import { IClass, IUser } from "@/client/store/types";

function ClassEditForm({
	data,
	handleSubmit,
}: {
	data: { _class: IClass; teachers: IUser[] };
	handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
	return (
		<div>
			<p className="pl-10">id:{data._class.id}</p>
			<form onSubmit={handleSubmit} className="flex flex-col w-min pl-10">
				<input
					type="hidden"
					name="id"
					className="block"
					defaultValue={data._class.id}
				/>
				<input
					type="text"
					name="title"
					className=""
					defaultValue={data._class.title}
					required
				/>
				<select
					name="teacher_id"
					id="teacher_id"
					defaultValue={data._class.teacher_id}
					required
				>
					<option value="">Teacher</option>
					{data.teachers.map((t, i) => (
						<option key={i} value={t.id}>
							{t.lastName} {t.role}
						</option>
					))}
				</select>
				<select
					name="status"
					id="status"
					defaultValue={data._class.status}
					required
				>
					<option value="">Status</option>
					<option value="active">Active</option>
					<option value="closed">Closed</option>
					<option value="draft">Draft</option>
				</select>
				<input
					type="number"
					name="year"
					defaultValue={data._class.year}
					required
				/>
				<Button type="submit" className="border mt-5">
					Submit
				</Button>
			</form>
		</div>
	);
}

export default function Home({ code }: { code: number }) {
	const param = useParams();
	console.log("code", code);
	const id = param?.id as string;
	const users = useSelector(entitySelector("users")) as Record<string, IUser>;
	const _class = useSelector(entitySelector("classes"))[id] ?? null;
	// if (!_class) dispatch<ClassAction>({ type: "getClassById", payload: { id } });

	const teachers =
		Object.entries(users)
			.map((u) => u[1])
			.filter((u) => u.role === UserRole.TEACHER) ?? null;
	// if (!teachers) dispatch<UserAction>({ type: "getAllUsers" });
	const data = { _class, teachers };
	// code = useSelector((state: AppState) => state.latestResponse).code;

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		const id = formData.get("class_id")?.toString();
		console.log("formData on page:", JSON.parse(JSON.stringify(data)));

		await fetch(`/api/classes/${id}`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	};
	return (
		<div>
			{code === 403 ? (
				<AccessDenied />
			) : !!data && data._class && data.teachers ? (
				<ClassEditForm data={data} handleSubmit={handleSubmit} />
			) : (
				<NoData />
			)}
		</div>
	);
}

export const getServerSideProps = ctx.resolve("getServerSideProps")(
	["ClassesController", "UsersController"]
	// "/classes/[id]"
);

// export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
// 	const log = ctx.resolve('Logger').log;
// 	store.dispatch({type:''})
// 	const gssp = ctx.resolve("getServerSideProps")(
// 			["ClassesController", "UsersController"]
// 			// "/classes/[id]"
// 		);
// 	const res = await gssp(context);
// 	let code = 500;
// 	if('props' in res){
// 		const props = (await res.props)
// 		const data = props.data;
// 		const classEntity = new ClassEntity();
// 		const userEntity = new UserEntity();
// 		const dataSchema = new schema.Entity('data',{
// 			_class: classEntity.getSchema(),
// 			teachers: [userEntity.getSchema()],
// 		})
// 		const normalData = normalize(data, dataSchema)
// 		store.dispatch(addEntities(normalData.entities))
// 		code = props.code;
// 	}
// 	return {props:{code}}
// })
