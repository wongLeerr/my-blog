import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { Tag , User } from 'db/entity'
import { ISession } from '..'
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/codes'

async function get(req: NextApiRequest, res: NextApiResponse) { 

    const session: ISession = req?.session
    const { type , tagId } = req?.body
    const { userId = 0 } = session
    
    const db = await prepareConnection();
    const tagRepo = db.getRepository(Tag)
    const userRepo = db.getRepository(User)

    // 获取此用户表(当前登录的用户表)
    const user = await userRepo.findOne({
        where: {
            id:userId
        }
    })

    // 获取当前tag
    const tag = await tagRepo.findOne({
        where: {
            id:tagId
        },
        relations:['users']
    }) 

    // 发现用户未登录
    if (!user) {
        res.status(200).json({
            ...EXCEPTION_USER.NOT_LOGIN
        })
        return
    }

    if (tag?.users) {
        if (type === 'follow') {
            // 表明为要关注（向tag.users表中插入当前登录用户信息即可）
            tag.users = tag.users.concat([user])
            tag.follow_count += 1
        } else if(type === 'unfollow') {
            // 表明要取关 （在tag.users表中干掉当前登录用户信息即可）
            tag.users = tag.users.filter(user => user.id !== userId)
            tag.follow_count -= 1
            console.log(tag)
        }
    }

    // 保存tag
    if (tag) {
        await tagRepo?.save(tag)
        res.status(200).json({
            code: 0,
        })
    } else {
        res.status(200).json({
            ...EXCEPTION_TAG.UPDATE_TAG_FAILED
        })
    }
    
}

export default withIronSessionApiRoute(get, ironOptions)