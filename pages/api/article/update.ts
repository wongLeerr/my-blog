import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { Article  } from 'db/entity/index'
import { EXCEPTION_ARTICLE } from '../config/codes'


async function update(req: NextApiRequest, res: NextApiResponse) { 

    const { title='', content='' , articleId=-1 } = req?.body
    
    // 连接数据库
    const db = await prepareConnection();
    const articleRepo = db.getRepository(Article)

    // 找到要更新的那一行表格数据
    const article = await articleRepo.findOne({
        where: {
            id:articleId
        },
        relations:['user']
    
    })

    if (article) {
        article.title = title
        article.content = content
        article.update_time = new Date()
        // 存入数据库
        const articleRes = await articleRepo.save(article)
        if (articleRes) {
            // 存入数据库成功
            res.status(200).json({
                code:0,
                data: articleRes,
                msg:'更新成功'
            })
        } else {
            // 存入数据库失败
            res.status(200).json({...EXCEPTION_ARTICLE.UPDATE_FAILED})
        }
    } else {
        res.status(200).json({...EXCEPTION_ARTICLE.NOT_FOUND})
    }

}

export default withIronSessionApiRoute(update, ironOptions)