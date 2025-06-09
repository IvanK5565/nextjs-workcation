import container from "./context/container"
import React from "react";

const ContainerContext = React.createContext<typeof container>({} as typeof container)
export default ContainerContext;
