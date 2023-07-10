import Link from 'next/link'
import { IArticle } from 'pages/api/index'
import styles from './index.module.scss'
import { EyeOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { formatDistanceToNow } from 'date-fns'
import markdownToTxt from 'markdown-to-txt'


interface IProps {
    article:IArticle
}

const ListItem = (props: IProps) => {

    const { article } = props
    // 可以拿到本文章相关联的用户表
    const { user } = article

    // 每一篇文章应为一个可点击并且要跳转的Link
    return <Link href={`/article/${article?.id}`}>
        <div className={styles.container}>
            <div className={styles.article}>
                {/* 用户信息（发表文章的用户名、文章更新时间等） */}
                <div className={styles.userInfo}>
                    <span className={styles.name}>
                        {user?.nickname}
                    </span>
                    <span className={styles.date}>
                        {  formatDistanceToNow(new Date(article.update_time)) }
                    </span>
                </div>
                {/* 文章信息 （标题、主体等）*/}
                <h3 className={styles.title}>{article.title}</h3>
                <p className={styles.content}>{markdownToTxt(article.content)}</p>
                <div className={styles.statistics}>
                    <EyeOutlined />
                    <span>{article.views}</span>
                </div>
            </div>
            <Avatar src={user.avatar} size={48} />
        </div>
    </Link>
} 

export default ListItem