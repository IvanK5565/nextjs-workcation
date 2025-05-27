

/* eslint-disable @typescript-eslint/no-unused-vars */
// /api/[[...slug]].ts
import { Routes } from "@/server/utils/routes";
import type { NextApiRequest, NextApiResponse } from "next";
import container from "../container/container";
// import { IControllerContainer } from ".";
import BaseController from "./BaseController";
import { Handler } from "@/types";
import { Logger } from "../logger";


// const api:[string, string & keyof IControllerContainer][] = BaseController.getRoutes();
// // {
// //   '/api/users': 'UsersController',
// //   '/api/users/[id]': 'UsersController',
// //   '/api/classes': 'ClassesController',
// //   '/api/classes/[id]': 'ClassesController',
// //   '/api/subjects': 'SubjectsController',
// //   '/api/subjects/[id]': 'SubjectsController',
// // }

// const routes:Routes = Routes.fromStrings(...api.map(route => route[0]));

export default function apiHandler(
):Handler{
  return async (req, res) => {
		const routesAndControlles = BaseController.getRoutes()
    Logger.info(routesAndControlles);
		const routes = Routes.fromStrings(...routesAndControlles.map(rc => rc[0]))
		const findedRoute = routes.findRoute(req.url ?? '')?.toString() ?? null;
		if(findedRoute){
			const controller = routesAndControlles.find(rc => rc[0]===findedRoute)?.[1];
			if(controller){
        Logger.info(findedRoute)
				return container.resolve(controller).handler(findedRoute)(req,res);
      }
		}
			res.status(404).json('Not Found');
      return;
		}
	}