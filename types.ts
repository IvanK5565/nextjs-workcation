import { Session } from "next-auth";
import { NextHandler } from "next-connect";
import {
	GetServerSideProps,
	NextApiRequest,
	NextApiResponse,
} from "next/types";
import Model from "sequelize/types/model";
import { IControllerContainer } from "./server/controllers";
import { StatusCodes } from "http-status-codes";

export type RouterRun = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<any>;

export type ActionResult = Model | Model[];

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
	Log = "log",
	Toast = "toast",
}

export type Response = {
	code: StatusCodes;
	success: boolean;
	data?: ActionResult;
	type?: AnswerType;
	message?: string;
};
export type Handler = (
	req: NextApiRequest,
	res: NextApiResponse
) => Promise<Response | void>;
export type ActionProps = {
	query?: Partial<{ [key: string]: string | string[] }>;
	body?: any;
	session: Session | null;
};
export type GSSPFactory = <K extends keyof IControllerContainer>(
	controllersNames: K[],
	route?: string
) => GetServerSideProps;
