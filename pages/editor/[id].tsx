// 本文件借助MarkDown插件实现MD编辑
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState ,useEffect} from "react"; 
import { Input , Button , message ,Select} from 'antd'
import styles from './index.module.scss'
import request from 'service/fetch';
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import { useRouter } from 'next/router'
import { prepareConnection } from 'db';
import { Article } from 'db/entity'; 
import { IArticle } from 'pages/api';

export async function getServerSideProps(ctx:any) {
    const { params } = ctx
    // 创建db连接
    const db =await prepareConnection()
    // 获取articles表
    const articleRepo = db.getRepository(Article)

    // 查询数据库表中此文章的详细信息及相关用户表
    const article =await articleRepo.findOne({
        relations: ['user','tags'],
        where: {
            id:params.id
        }
    })

    console.log("article:",article)

    return {
        props: {
            article:JSON.parse(JSON.stringify(article))
        }
    }

    
}


// 创建一个MD编辑器
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface IProps {
    article:IArticle
}

const ModifyEditor = (props:IProps) => {

    // 获取文章信息
    const { article } = props 

    const ids: any = []
    article.tags.forEach((tag :any) => {
        ids.push(tag?.id)
    })

    const router = useRouter()
    const { push } = router

    // 文章标题
    const [title, setTitle] = useState(`${article.title}`)
    
     // 所有标签
     const [allTags, setAllTags] = useState([])
     // 选中的下拉框中的标签
    const [tagIds, setTagIds] = useState([])
    
    // 获取所有标签
    useEffect(() => {
        request.get('/api/tag/get').then((res: any) => {
            if (res.code === 0) {
                setAllTags(res?.data?.allTags || [])
            }
        })
    }, [])

    // value即为输入的值，当在编辑器中输入内容的时候，动态执行setValue实现MD效果
    const [content, setContent] = useState(`${article.content}`)
    
    // 创建 store
    const store = useStore()
    // 获取userId
    const {userId} = store.user.userInfo 

    // 发布
    const handleUpdate = () => {
        // 未输入标题，提示
        if (!title) {
            message.warning("请输入文章标题!")
            return;
        }
        // 调API实现发布文章
        request.post("/api/article/update", {
            title,
            content,
            articleId: article.id,
            // newTagIds: tagIds,
            // oldTagIds: ids
        }).then((res:any) => {
            if (res.code === 0) {
                // 发布成功
                message.success("更新成功")
                // 跳转至文章详情页
                // console.log("发布成功的userId:",userId)
                article.id ? push(`/article/${article.id}`) : push(`/`)
            } else {
                message.error(res?.msg || "更新失败!")
            }
            }, (err) => {
                message.error(err || "未知错误")
        })

    }

    // 标题输入框onChange事件回调
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e?.target?.value)
    }

    // MD 编辑器内容变化执行的回调
    const handleContentChange = (content:any) => {
        setContent(content)
    }

    // 标签选择框发生变化
    const handleSelectChange = (ids: []) => {
        setTagIds(ids)
    }


    return (
        <div className={styles.container}>
           {/* 操作区 */}
            <section className={styles.operation}>
                <Input className={styles.title} placeholder='请输入文章标题' value={title} onChange={handleTitleChange} />
                <Select className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectChange}  defaultValue={ids}>
                    {
                        allTags.map((tag:any) => {
                            return <Select.Option key={tag.id} value={tag.id}>{ tag.title }</Select.Option>
                        })
                    }
                </Select>
                <Button className={styles.button} type="primary" onClick={handleUpdate}>更新文章</Button>
            </section>
            {/* MD编辑器 */}
            <MDEditor value={content} onChange={ handleContentChange } height={1080}></MDEditor>
        </div>
    )

}

// NewEditor本质上是一个函数，因此也是一个对象，其身上可以挂载layout属性，实现是否展示页头页脚
(ModifyEditor as any).layout = null

export default observer(ModifyEditor) 