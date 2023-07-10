import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User } from 'db/entity/index'
import { ISession } from '..'
import { EXCEPTION_USER } from '../config/codes'


async function detail(req: NextApiRequest, res: NextApiResponse) {
    
    const session: ISession = req?.session 
    const db = await prepareConnection()
    const userRepo = db.getRepository(User)
    // 找到当前用户的表
    const user = await userRepo.findOne({
        where: {
            id :Number(session?.userId)
        }
    })
    if (user) {
        res?.status(200).json({
            code: 0,
            data: {
                userInfo:user
            }
        })
    } else {
        res?.status(200).json({
           ...EXCEPTION_USER.NOT_FOUND
        })
    }


}



export default withIronSessionApiRoute(detail, ironOptions)