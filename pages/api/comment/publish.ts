import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User , Article ,Comment } from 'db/entity/index'
import { ISession } from '..'
import { EXCEPTION_COMMENT } from '../config/codes'


async function publish(req: NextApiRequest, res: NextApiResponse) { 

    const session: ISession = req.session
    const { content , article_id } = req?.body
    
    // 连接数据库
    const db = await prepareConnection();
    const userRepo = db.getRepository(User)
    const articleRepo = db.getRepository(Article)
    const commentRepo = db.getRepository(Comment)

    const comment = new Comment()
    comment.content = content
    comment.create_time = new Date()
    comment.update_time = new Date()

    // 根据当前登录的用户id找到相应用户表（只是User表的一行）
    const findUser =await userRepo.findOne({
        id:session.userId
    })
    // 根据当前文章的id找到相应文章表 (只是Article表的一行)
    const findArticle =await articleRepo.findOne({
        id:article_id
    })

    // 将找到的用户表和文章表相关联信息与评论表关联
    if (findUser) {
        comment.user = findUser
    }

    if (findArticle) {
        comment.article =findArticle
    }

    // 存入数据库
    const commentRes = await commentRepo.save(comment)

    if (commentRes) {
        // 存入数据库成功
        res.status(200).json({
            code:0,
            data: commentRes,
            msg:'发布成功'
        })
    } else {
        // 存入数据库失败
        res.status(200).json({...EXCEPTION_COMMENT.PUBLISH_FAILED})
    }
   
}

export default withIronSessionApiRoute(publish, ironOptions)