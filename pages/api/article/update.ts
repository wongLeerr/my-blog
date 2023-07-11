import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity/index'
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
    // console.log("9999999999999999999999999999999999artile:",article)
    // 更新操作比较复杂，因为更新后的标签既有可能加了一些新标签，也有可能去掉了原来的标签
    // 因此首先将标签分为三类：
    // 1.新增的标签，这些标签需要article_count + 1, 并且这些字段需要添加到article表对应的tags字段中
    // 2.不变的标签，不用管撒
    // 3.去掉的标签，这些标签需要article_count - 1, 并且这些字段需要消除到article表对应的tags字段中
    // 首先先找出这三类 tag
    // const newAddTagIds = []
    // const sameTagIds= []
    // const removeTagIds = []
    
    // for (let i = 0; i < newTagIds.length; i++){
    //     for (let j = 0; j < oldTagIds.length; j++){
    //         if (newTagIds[i] === oldTagIds[j]) {
    //             sameTagIds.push(newTagIds[i])
    //         }
    //     }
    // }

    //  // 求出新增的tagId
    // let arr1 = new Set(sameTagIds)//原数组
    // let arr2 = new Set(newTagIds)//新数组
            
    // for(let k of arr2){
    //     if(!arr1.has(k)){
    //         newAddTagIds.push(k)
    //     }
    // }

    // // 求出移除的tagId
    // let arr3 = new Set(sameTagIds)//原数组
    // let arr4 = new Set(oldTagIds)//新数组
            
    // for(let k of arr4){
    //     if(!arr3.has(k)){
    //         removeTagIds.push(k)
    //     }
    // }

    
    // const newTag = await tagRepo.find({
    //     where:newAddTagIds.map((tagId:number) => ({ id: tagId }))
    // })

    // if (newTag) {
    //     const newTags = newTag.map((tag) => {
    //         tag.article_count += 1
    //         return tag
    //     })
    //     // 将article的tags字段设定为这些标签
    //     article.tags = article.tags.concat(newTags)
    // }

    // const removeTag = await tagRepo.find({
    //     where:removeTagIds.map((tagId:number) => ({ id: tagId }))
    // })

    // if (removeTag) {
        
    //     removeTag.forEach((tag) => {
    //         tag.article_count = tag.article_count-1
    //     })

    //     const newArticleTags = [...article.tags]
        
    //     for (let i = 0; i < newArticleTags.length; i++){
    //         for(let j=0;j<removeTagIds.length;j++){
    //             if(newArticleTags[i].id === removeTagIds[j]){
    //                 newArticleTags.splice(i,1)
    //             }
    //         }
    //     }

    //     article.tags = newArticleTags
        
    // }


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