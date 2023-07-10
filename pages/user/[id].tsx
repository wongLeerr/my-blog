import React from "react"
import { Button , Avatar ,Divider} from 'antd';
import { observer } from "mobx-react-lite";
import styles from './index.module.scss'
// 获取antd中所有icon图标
import { CodeOutlined,FireOutlined,FundViewOutlined ,SketchOutlined,EditOutlined} from '@ant-design/icons'
import { prepareConnection } from "db";
import { User, Article } from "db/entity";
import Link from 'next/link'
import ListItem from "components/ListItem";


export async function getServerSideProps({params}:any) {
    // id 为 userId
    const userId= params?.id
    const db = await prepareConnection()

    const userRepo = db.getRepository(User)
    const articleRepo = db.getRepository(Article)
    const user = await userRepo.findOne({
        where:{
            id:Number(userId)
        }
    })
    const articles = await articleRepo.find({
        where: {
            user: {
                id:Number(userId)
            }
        },
        relations: ['user','tags']
    })


    return {
        props: {
            userInfo: JSON.parse(JSON.stringify(user)),
            articles: JSON.parse(JSON.stringify(articles))
        }
    }

}


const UserDetial = (props: any) => {

    console.log(props)

    const userInfo = props?.userInfo || {}
    const articles = props?.articles || []
    console.log(userInfo, articles)
    
    const viewsCount = articles?.reduce((prev: any, next: any) => (prev + next?.views), 0)

    return (
        <div className={styles.userDetail}>
            {/* 左侧放用户信息 */}
            <div className={styles.left}>
                <div className={styles.userInfo}>
                    <Avatar src={userInfo?.avatar} size={90} className={styles.avatar}></Avatar>
                    <div>
                        <div className={styles.nickname}>{userInfo?.nickname}</div>
                        <div className={styles.desc}>
                            <CodeOutlined />{userInfo?.job}
                        </div>
                        <div className={styles.desc}>
                            <FireOutlined />{userInfo?.introduce}
                        </div>
                    </div>
                    <Link href="/user/profile"><Button>编辑个人资料</Button></Link>
                </div>
                <Divider />
                <div className={styles.article}>
                    {
                        articles.map((article: any) => {
                            return (<div key={article.id}>
                                <ListItem article={article}></ListItem>
                                <Divider/>
                            </div>)
                        })
                    }
                </div>
            </div>
            {/* 右侧放用户成就 */}
            <div className={styles.right}>
                <div className={styles.achievement}>
                    <div className={styles.header}>
                    <SketchOutlined />
                        个人成就
                    </div>
                    <div className={styles.number}>
                        <div className={styles.wrapper}>
                        <EditOutlined />
                            <span>共创作 { articles?.length } 文章</span>
                        </div>
                        <div className={styles.wrapper}>
                            <FundViewOutlined />
                            <span>文章被阅读 { viewsCount } 次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(UserDetial)