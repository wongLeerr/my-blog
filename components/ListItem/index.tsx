import Link from 'next/link'
import { IArticle } from 'pages/api/index'
import styles from './index.module.scss'

interface IProps {
    article:IArticle
}

const ListItem = (props: IProps) => {

    const { article } = props

    // 每一篇文章应为一个可点击并且要跳转的Link
    return <Link href={`/article/${article.id}`}>
        <div className={styles.container}>
            <div className={styles.article}></div>
        </div>
    </Link>
} 

export default ListItem