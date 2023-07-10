import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User } from 'db/entity/index'
import { ISession } from '..'
import { EXCEPTION_USER } from '../config/codes'


async function update(req: NextApiRequest, res: NextApiResponse) {
    
    const session: ISession = req?.session 
    const db = await prepareConnection()
    const userRepo = db.getRepository(User)
    const { job, introduce, nickname } = req?.body
    // 找到当前用户的表
    const user = await userRepo.findOne({
        where: {
            id :Number(session?.userId)
        }
    })
    if (user) {

        user.job = job
        user.introduce = introduce
        user.nickname = nickname

        userRepo.save(user)

        res?.status(200).json({
            code: 0,
        })
    } else {
        res?.status(200).json({
           ...EXCEPTION_USER.MODIFY_ERROR
        })
    }


}



export default withIronSessionApiRoute(update, ironOptions)