import { useState } from "react";
import { useAcl } from "../../client/hooks/useAcl";
import { IMenu, IMenuData } from "../../client/types";

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
