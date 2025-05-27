import container from "@/server/container/container";
// import apiHandler from "@/server/controllers/apiHandler";

export default container.resolve('ClassesController').handler('/api/classes')
// export default apiHandler();