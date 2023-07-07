// 本文件借助MarkDown插件实现MD编辑
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from "react"; 
import { Input , Button , message} from 'antd'
import styles from './index.module.scss'
import request from 'service/fetch';
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import { useRouter } from 'next/router'


// 创建一个MD编辑器
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {

    const router = useRouter()
    const { push } = router

    // 文章标题
    const [title,setTitle] = useState("")

    // value即为输入的值，当在编辑器中输入内容的时候，动态执行setValue实现MD效果
    const [content, setContent] = useState("")
    
    // 创建 store
    const store = useStore()
    // 获取userId
    const {userId} = store.user.userInfo 

    // 发布
    const handlePublish = () => {
        // 未输入标题，提示
        if (!title) {
            message.warning("请输入文章标题!")
            return;
        }
        // 调API实现发布文章
        request.post("/api/article/publish", {
            title,
            content
        }).then((res:any) => {
            if (res.code === 0) {
                // 发布成功
                message.success("发布成功")
                // 跳转至个人信息页
                // console.log("发布成功的userId:",userId)
                userId ? push(`/user/${userId}`) : push(`/`)
            } else {
                message.error(res?.msg || "发布失败!")
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


    return (
        <div className={styles.container}>
           {/* 操作区 */}
            <section className={styles.operation}>
                <Input className={styles.title} placeholder='请输入文章标题' value={title} onChange={handleTitleChange} />
                <Button className={styles.button} type="primary" onClick={handlePublish}>发布文章</Button>
            </section>
            {/* MD编辑器 */}
            <MDEditor value={content} onChange={ handleContentChange } height={1080}></MDEditor>
        </div>
    )

}

// NewEditor本质上是一个函数，因此也是一个对象，其身上可以挂载layout属性，实现是否展示页头页脚
(NewEditor as any).layout = null

export default observer(NewEditor) 