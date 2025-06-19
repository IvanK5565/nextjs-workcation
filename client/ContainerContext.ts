import container from "./di/container"
import React, { useContext } from "react";

const ContainerContext = React.createContext<typeof container>({} as typeof container)
export default ContainerContext;
export function useContainerContext(){
  return useContext(ContainerContext);
}