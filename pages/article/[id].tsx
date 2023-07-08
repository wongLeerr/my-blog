import { prepareConnection } from "db"
import { Article } from "db/entity"
import { IArticle} from "pages/api"
import styles from './index.module.scss'
import { Avatar ,Input , Button ,message ,Divider} from 'antd'
import { format } from 'date-fns'
import { observer } from "mobx-react-lite"
import { useStore } from "store" 
import Link from 'next/link'
import MarkDown from "markdown-to-jsx"
import { useState } from "react"
import request from "service/fetch"
import { userInfo } from "os"

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
          id : articleId  
        },
        relations:['user','comments','comments.user']
    })

    console.log("articles:",article)

    // 执行views加一的操作
    if (article) {
        article.views = article.views + 1
        await articleRepo.save(article)
    }

    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
        }
    }

}



interface IProps {
    article: IArticle,
}


const ArticleDetail = (props: IProps) => {
    
    const store = useStore()
    // loginUserId : 当前登录的用户id
    // articleUserId : 这篇文章的作者id
    // articleId : 这篇文章的id
    const { user: { userInfo: { userId:loginUserId ,avatar:loginUseravatar,nickname:loginUserNickname} } } = store
    const { article } = props
    const { id: articleId, content, title, update_time, views, user: { avatar, nickname, id: articleUserId } } = article
    console.log("loginUserId:",loginUserId)
    console.log("articleUserId:",articleUserId)
    console.log("articleId:", articleId)
    // 评论框内容
    const [inputVal, setInputVal] = useState("") 
    // 使用state代理comments，原因在于方便下面 假数据的展示
    const [comments,setComments] = useState(article.comments)

    const handleInputValChange = (e: any) => {
        setInputVal(e.target.value)
    }

    // 发表评论
    const handleComment = () => {
        request.post('/api/comment/publish', {
            content: inputVal,
            article_id: articleId,
        }).then((res:any) => {
            if (res?.code === 0) {
                message.success("评论成功")
                
                // 由于此项目为SSR项目，添加的评论不会实时显示在页面上，这时可以在前端实现一个假更新，
                // 用户刷新页面时就会拿到真实的数据替换掉假数据
                // 将新造的假数据放到前面以前的评论数据放到后面
                const newComments = [
                    {
                        id: Math.random(),
                        create_time: new Date(),
                        update_time: new Date(),
                        content: inputVal,
                        user: {
                            avatar: loginUseravatar,
                            nickname:loginUserNickname
                        }
                        
                    }
                ].concat([...comments])
                // 更新评论区列表数据
                setComments([...newComments])
                // 清空评论框内容
                setInputVal("")
            }
        }, err => {
            message.error(err || "评论失败!")
             // 清空评论框内容
             setInputVal("")
        }).catch(err => {
            message.error(err || "未知错误")
        })
    }


    return (
        <div>
            <div className='content-layout'>
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
            <section className={styles.devider}></section>
            <main className='content-layout'>
                <div className={styles.comment}>
                    <h4 className={styles.commentTitle}>评论</h4>
                    {/* 只有登录的用户才能看到输入框 */}
                    {
                        (!loginUserId || loginUserId == -1) ?
                            // 未登录状态要展示的
                            null :
                            // 已登录状态要展示的
                            <section className={styles.enter}>
                                <Avatar src={avatar} size={40} className={styles.avatar}></Avatar>
                                <div className={styles.content}>
                                    <Input.TextArea placeholder="请输入评论" rows={3} value={inputVal} onChange={handleInputValChange} className={styles.input} />
                                    <Button type="primary" onClick={ handleComment }>发表评论</Button>
                                </div>
                            </section>    
                    }
                </div>
                <Divider />
                <section className={styles.display}>
                    {
                        comments?.map((comment:any) => {
                            return (
                                <div className={styles.wrapper} key={comment.id}>
                                    <Avatar src={comment?.user?.avatar} size={40} />
                                    <div className={styles.info}>
                                        <div className={styles.name}>
                                            <div> {comment?.user?.nickname} </div>
                                            <div className={styles.date}>
                                                {
                                                    format(new Date(comment.update_time),'yyyy-MM-dd hh:mm:ss')
                                                }
                                            </div>
                                    </div>
                                        <div className={styles.content}>
                                            { comment?.content }
                                        </div>
                                    </div>
                                </div>
                            )
                            
                       })
                    }
                </section>
            </main>
        </div>)
   
}


export default observer(ArticleDetail) 