import { IEntityContainer } from "../entities";
import { RequestStatus } from "../constants";

// TODO
export function useRequestSelector(){
  return {
    'UserEntity': {status:RequestStatus.LOADING},
    'ClassEntity': {status:RequestStatus.LOADING},
    'SubjectEntity': {status:RequestStatus.LOADING},
  } as Record<keyof IEntityContainer, {status:RequestStatus}>;
}