import container from '@/server/container/container'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  container.resolve('db').sync();
  res.status(200).json({sync: 'Success'})
}