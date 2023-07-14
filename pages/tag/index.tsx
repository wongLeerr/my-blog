import React, { useState, useEffect } from "react"
import { Tabs , message ,Button} from 'antd';
import { useStore } from "store";
import { observer } from "mobx-react-lite";
import request from "service/fetch";  
import styles from './index.module.scss'
// 获取antd中所有icon图标
import * as ANTD_ICONS from '@ant-design/icons'

interface IUser {
    id: number;
    nickname: string;
    avatar:string
}

interface ITag {
    id: number;
    title: string;
    icon: string;
    follow_count: number;
    article_count: number;
    users:IUser[]
}


const Tag = () => {
    // 获取store中保存的用户信息，也就是当前登录的用户的基本信息
    const store = useStore()
    const { userId } = store?.user?.userInfo
    
    // 当前用户关注的tags
    const [followTags, setFollowTags] = useState<ITag[]>()
    // 所有的tags
    const [allTags, setAllTags] = useState<ITag[]>()

    const [needRefresh,setNeedRefresh] = useState(false)
    // 获取标签数据数据
    useEffect(() => {
        request.get('/api/tag/get').then((res:any) => {
            if (res.code === 0) {
                // console.log("followTags:", res.data.followTags)
                // console.log("allTags:",res.data.allTags)
                const { followTags=[], allTags = [] } = res?.data
                setFollowTags(followTags)
                setAllTags(allTags)
            }
        }, err => {
            message.error("获取标签时服务器出现了问题",err)
        })
    }, [needRefresh])
    
    // 当用户点击已关注按钮的时候(已经关注了，再点击那就是不再关注了)
    const handleUnFollow = (tagId: number) => {
        request.post('/api/tag/follow', {
            // type为follow表明为关注，unFollow表明为取关
            type: 'unfollow',
            tagId
        }).then((res:any) => {
            if (res.code === 0) {
                message.success("已取消关注")
                setNeedRefresh(!needRefresh)
            }
        }, err => {
            message.error("取消关注标签时服务器出现了问题...",err)
        })
    }

    // 当用户点击关注此标签时，表明用户还未关注此标签
    const handleGoFollow = (tagId: number) => {
        request.post('/api/tag/follow', {
            // type为follow表明为关注，unfollow表明为取关
            type: 'follow',
            tagId
        }).then((res:any) => {
            if (res.code === 0) {
                message.success("已关注")
                setNeedRefresh(!needRefresh)
            }
        }, err => {
            message.error("关注标签时服务器出现了问题...",err)
        })
    }

    return (
        <div className='content-layout'>
            <Tabs defaultActiveKey="all"
                items={[
                    {
                        label: `已关注标签页`,
                        key: 'follow',
                        children: (
                            <div className={styles.tags}>
                                {
                                     followTags?.map((tag:any) => {
                                        return (
                                            <div key={tag?.title} className={styles.tagWrapper}>
                                                <div>{( ANTD_ICONS  as any)[tag?.icon]?.render()}</div>
                                                <div className={styles.title}>{tag?.title}</div>
                                                <div className={styles.operate}>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                                                {
                                                    tag.users.find((user: any) => Number(user.id) === Number(userId)) 
                                                        ?
                                                        (<Button type="primary"  onClick={() => handleUnFollow(tag?.id)} >已关注此标签</Button>)
                                                        :
                                                        (<Button  onClick={() => handleGoFollow(tag?.id)}>关注此标签</Button>)
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    },
                    {
                        label: `全部标签`,
                        key: 'all',
                        children: (
                            <div>
                                {
                                    allTags?.length === 0 ? <div>loading...</div> :
                                    <div className={styles.tags}>
                                    {
                                        allTags?.map((tag:any) => {
                                            return (
                                                <div key={tag?.title} className={styles.tagWrapper}>
                                                    <div>{( ANTD_ICONS  as any)[tag?.icon]?.render()}</div>
                                                    <div className={styles.title}>{tag?.title}</div>
                                                    <div className={styles.operate}>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                                                    {
                                                        tag?.users?.find((user: any) => Number(user.id) === Number(userId)) 
                                                            ?
                                                            (<Button type="primary"  onClick={() => handleUnFollow(tag?.id)} >已关注此标签</Button>)
                                                            :
                                                            (<Button  onClick={() => handleGoFollow(tag?.id)}>关注此标签</Button>)
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                }
                            </div>
                            
                        )
                    }
                ]}
            >

            </Tabs>
        </div>
    )
}

export default observer(Tag)