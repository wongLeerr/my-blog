import { prepareConnection } from "db"
import { Article } from "db/entity"
import { IArticle } from "pages/api"
import styles from './index.module.scss'
import { Avatar } from 'antd'
import { format } from 'date-fns'
import { observer } from "mobx-react-lite"
import { useStore } from "store" 
import Link from 'next/link'
import MarkDown from "markdown-to-jsx"

export async function getServerSideProps(ctx: any) {
    
    // params 为上游组件传递的路由参数（也可传递query参数）
    const { params } = ctx
    // 获取文章的id
    const articleId = params.id

    // 创建db连接
    const db = await prepareConnection()
    // 可以认为 articleRepo 就是 articles 表的操作对象
    const articleRepo = db.getRepository(Article)
    // 获取文章列表组件中点击的那篇文章详细信息，顺带这篇文章的用户信息
    const article = await articleRepo.findOne({
        where: {
          id:articleId  
        },
        relations:['user']
    })
    
    // 执行views加一的操作
    if (article) {
        article.views = article.views + 1
        await articleRepo.save(article)
    }

    // console.log("文章详情页从db中查询的article:",article)

    return {
        props: {
            article:JSON.parse(JSON.stringify(article))
        }
    }

}

interface IProps {
    article:IArticle
}


const ArticleDetail = (props: IProps) => {
    
    
    const store = useStore()
    // loginUserId : 当前登录的用户id
    // articleUserId : 这篇文章的作者id
    // articleId : 这篇文章的id
    const { user: { userInfo: { userId:loginUserId } } } = store
    const { article } = props
    // console.log(article)
    const {id:articleId, content, title, update_time, views, user: { avatar, nickname, id:articleUserId } } = article
    console.log("loginUserId:",loginUserId)
    console.log("articleUserId:",articleUserId)
    console.log("articleId:",articleId)


    return <div className='content-layout'>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.user}>
            <Avatar src={avatar} size={50} />
            <div className={styles.info}>
                <div className={styles.name}>{nickname}</div>
                <div className={styles.date}>
                    <div>{format(new Date(update_time),'yyyy-MM-dd hh:mm:ss')}</div>
                    <div>阅读量 {views}</div>
                    {
                        Number(loginUserId) === Number(articleUserId) &&  <Link href={`/editor/${articleId}`} className={styles.editLink}>编辑此文章</Link>
                    }
                </div>
            </div>
        </div>
        {/* 以markdown的格式渲染文章 */}
        <MarkDown className={styles.markdown}>
            {content}
        </ MarkDown>
    </div>
   
}


export default observer(ArticleDetail) 