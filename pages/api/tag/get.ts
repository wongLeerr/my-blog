import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import {Tag } from 'db/entity'
import { ISession } from '..'
import { EXCEPTION_TAG } from '../config/codes'


async function get(req: NextApiRequest, res: NextApiResponse) { 

    const session: ISession = req?.session
    const { userId = -1  } = session
    
    const db = await prepareConnection();
    const tagRepo = db.getRepository(Tag)

    // 获取用户已关注tag
    const followTags = await tagRepo.find({
        relations: ['users'],
        // 当前用户id和tag表中用户id相匹配的
        where: (qb:any) => {
            qb.where('user_id = :id',{
                id:Number(userId)
            })
        }
    })
    // 获取全部tag
    const allTags = await tagRepo.find({
        relations: ['users'],
    })

    if (followTags && allTags) {
        // 存入数据库成功
        res.status(200).json({
            code:0,
            data: {
                followTags,
                allTags
            },
            msg:'获取标签成功'
        })
    } else {
        res.status(200).json({
            ...EXCEPTION_TAG.GET_TAG_FAILED
        })
    }

       
   
}

export default withIronSessionApiRoute(get, ironOptions)