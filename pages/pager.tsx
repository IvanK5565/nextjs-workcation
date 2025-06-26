import { useActions } from "@/client/hooks/useActions";
import { usePageItems } from "@/client/hooks/usePageItems";
import { pageSetParams } from "@/client/store/actions";
import { DataCard } from "@/components/admin/entitiesExplorer";
import Button from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";

function Pager() {
	const [page, setPage] = useState(1);
	const { fetchUsersPage: fetchProjectPage } = useActions("UserEntity");
	const dispatch = useDispatch();
	const usersPage = usePageItems('users');
	return (
		<div>
			<div className="flex flex-col w-max gap-1 mb-2 mx-10">
				<select
					name="page"
					id="page"
					onChange={({ target: { value } }) => {
						setPage(parseInt(value))
						dispatch(pageSetParams('users', {currentPage:parseInt(value)}))
					}}
				>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<div className="flex gap-1">
					<Button
						type="button"
						onClick={() =>
							fetchProjectPage({ pageName: "users", page: page, perPage: 10 })
						}
					>
						Fetch
					</Button>
					<Button onClick={() => dispatch({ type: "DELETE_ALL" })}>Delete ALl</Button>
				</div>
			</div>
			{usersPage.map((u, key) => (
				<DataCard key={key} data={u ?? {}} />
			))}
		</div>
	);
}

export default Pager;
