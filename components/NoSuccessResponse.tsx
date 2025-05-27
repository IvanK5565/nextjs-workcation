import { Response } from "@/types";
import AccessDenied from "./AccessDenied";
import NoData from "./NoData";

export default function NoSuccessResponce({ res }: { res: Response }) {
	return res.success ? (
		<div></div>
	) : res.code == 403 ? (
		<AccessDenied />
	) : (
		<NoData />
	);
}
