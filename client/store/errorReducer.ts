export const errorReducer = (error: string = "", action: { type: string; payload?: string }) =>
action.type === "Error" && !!action.payload ? action.payload : error;