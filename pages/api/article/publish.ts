import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User , Article  } from 'db/entity/index'
import { ISession } from '..'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'
import { EXCEPTION_ARTICLE } from '../config/codes'


async function publish(req: NextApiRequest, res: NextApiResponse) { 

    console.log("publish执行!!!")

    const session: ISession = req.session
    const { title, content } = req?.body
    
    // 连接数据库
    const db = await prepareConnection();
    const userRepo = db.getRepository(User)
    const articleRepo = db.getRepository(Article)

    // 这里可以理解为创建一行 article 表，随后将这一行插入至article表
    const article = new Article()

    article.title = title
    article.content = content
    article.create_time = new Date()
    article.update_time = new Date()
    article.is_delete = 0
    article.views = 0

    // 获取写文章的用户信息
    const user =await userRepo.findOne({
        id : session.userId
    })

    // 将写文章的用户信息写入article中的user列(本质就是将每一篇文章与一个用户关联)
    if (user) {
        article.user = user
    }

    // 存入数据库
    const articleRes = await articleRepo.save(article)

    console.log("use:", user)
    console.log("article:", article)
   
    if (articleRes) {
        // 存入数据库成功
        res.status(200).json({
            code:0,
            data: articleRes,
            msg:'发布成功'
        })
    } else {
        // 存入数据库失败
        res.status(200).json({...EXCEPTION_ARTICLE.PUBLISH_FAILED})
    }
   
    

}

export default withIronSessionApiRoute(publish, ironOptions)