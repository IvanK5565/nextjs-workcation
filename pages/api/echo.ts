import container from '@/server/container/container'
import type { NextApiRequest, NextApiResponse } from 'next'
 
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const data = req.body
//   console.log("ECHO: ", data)
//   res.status(200).json(data)
// }

export default container.resolve('UsersController').handler();