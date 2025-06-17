import { useActions } from "@/client/hooks";
import { AppState } from "@/client/store/ReduxStore";
import { usersSelector } from "@/client/store/selectors";
import { DataCard } from "@/components/admin/entitiesExplorer";
import Button from "@/components/ui/button";
import { get } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";

function Pager() {
	const [page, setPage] = useState(1);
	const { fetchProjectPage } = useActions("UserEntity");
	const usersPage =
		useSelector<AppState, AppState["pagination"]>((state) => state.pagination)[
			"users"
		]?.pages?.[page] ?? [];
	const users = useSelector(usersSelector);
	return (
		<div>
			<div className="flex flex-col w-min gap-1 m-1">
				<select
					name="page"
					id="page"
					onChange={({ target: { value } }) => setPage(parseInt(value))}
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
				</div>
			</div>
			{usersPage.map((u, key) => (
        <DataCard key={key} data={get(users, [u]) ?? {}} />
			))}
		</div>
	);
}

export default Pager;
