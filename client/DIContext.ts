import container from "./di/container"
import React from "react";

const DIContext = React.createContext<typeof container>({} as typeof container)
export default DIContext;
