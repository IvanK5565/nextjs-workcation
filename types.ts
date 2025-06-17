import { Session } from "next-auth";
import { NextHandler } from "next-connect";
import {
	GetServerSideProps,
	NextApiRequest,
	NextApiResponse,
} from "next/types";
import { IControllerContainer } from "./server/controllers";
import { StatusCodes } from "http-status-codes";
import Guard from "./acl/Guard";
import { Classes, Subjects, User, UserClasses } from "./server/models";
import { IPagerParams } from "./client/paginatorExamples/types";

export type RouterRun = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<ActionResult>;

export type Entity = User | Classes | Subjects | UserClasses;

export type ActionResult = Entity | Entity[] | {
	items:Entity | Entity[],
	count:number,
};

export type Middleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	next: NextHandler
) => ActionResult | Promise<ActionResult>;

export type MethodHandler = {
	method: string;
	handler: string;
};

export type ActionAdapter = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<ActionResult>;

export type Action = (props: ActionProps) => Promise<ActionResult>;

export enum AnswerType {
	Data = 'data',
	Log = "log",
	Toast = "toast",
}

export type Response = {
	code: StatusCodes;
	success: boolean;
	data?: ActionResult;
	type?: AnswerType;
	message?: string;
	pager?:IPagerParams;
};
export type Handler = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<ActionResult | void>;
export type ActionProps = {
	query?: Partial<{ [key: string]: string | string[] }>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	body?: any;
	session: Session | null;
	guard:Guard;
	pager:IPagerParams;
};
export type GSSPFactory = (
	controllersNames: (keyof IControllerContainer)[],
	isPublic?:boolean,
	route?: string
) => GetServerSideProps;
