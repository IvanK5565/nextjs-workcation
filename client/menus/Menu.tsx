/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useAcl } from "../hooks";
import { IMenu, IMenuData } from "../types";

export function FilterMenu(menu:IMenu):IMenu{
	const { allow } = useAcl();
	return Object.fromEntries(Object.entries(menu).filter(([key, value]) => (value.grant ? allow(value.grant, key) : true)))
}

export function RenderMenu({ menu }: { menu: IMenu }) {
	const { allow } = useAcl();
	return Object.entries(menu)
		.filter(([key, value]) => (value.grant ? allow(value.grant, key) : true))
		.map(([key, value]) => (
			<MultiLevelMenuItem
				// getLinkHrefAs={getLinkHrefAs}
				key={key}
				// dataKey={key}
				menuItem={value}
			/>
		));
}

function MultiLevelMenuItem({
	menuItem,
}: {
	menuItem: IMenuData;
}) {
	const [expanded, setExpanded] = useState(false);
	if (menuItem.items && Object.keys(menuItem.items).length > 0) {
		return (
			<div>
				<button onClick={() => setExpanded((prev) => !prev)}>
					{menuItem.component}
				</button>
				<div hidden={!expanded}>
					<RenderMenu menu={menuItem.items} />
				</div>
			</div>
		);
	}
	return menuItem.component;
}
