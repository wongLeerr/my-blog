import { observer } from "mobx-react-lite"
import { Form , Input , Button ,Avatar, message } from 'antd'
import styles from './index.module.scss'
import { useEffect , useState } from "react"
import request from "service/fetch"
import { useRouter } from "next/router"


const UserProfile = () => {

    const { push } = useRouter()
    const [avatarUrl,setAvatarUrl] =  useState('')
    // 组件刚挂载 那就请求一下用户数据作为表单的默认信息
    useEffect(() => {
        request.get('/api/user/detail').then((res: any) => {
            if (res?.code === 0) {
                setAvatarUrl(res?.data?.userInfo?.avatar)
                form.setFieldsValue(res?.data?.userInfo)
            }
        }).catch((err) => {
            console.log(err)
        })
    },[])

    // 用于存储表单数据的对象
    const [form] = Form.useForm()

    // 布局相关描述 （格栅布局）
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: {span :16}
    } 

    const tailLayout = {
        wrapperCol: {
            offset:4
        }
    }

    // 提交表单
    const handleSubmit = (formData :any) => {
        request.post('/api/user/update', {
            ...formData
        }).then((res: any) => {
            if (res?.code === 0) {
                message.success("修改成功")
                push("/")
            } else {
                message.error("修改失败！")
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (<div className='content-layout'>
        <div className={styles.userProfile}>
            <h2 className={styles.profile}>个人资料</h2>
            <section>
                <Form {...layout} form={form} className={styles.form} onFinish={handleSubmit} >
                    <Form.Item label="头像" name="avatar">
                        <Avatar src={avatarUrl} size={40} />
                    </Form.Item>
                    <Form.Item label="用户名" name="nickname">
                        <Input placeholder="请输入用户名"></Input>
                    </Form.Item>
                    <Form.Item label="职位" name="job">
                        <Input placeholder="请输入职位"></Input>
                    </Form.Item>
                    <Form.Item label="个人介绍" name="introduce">
                        <Input.TextArea placeholder="请输入个人介绍" rows={3}></Input.TextArea>
                    </Form.Item>
                    <Form.Item  {...tailLayout}>
                       <Button type="primary"  htmlType="submit">保存修改</Button>
                    </Form.Item>
                </Form>
            </section>
        </div>
    </div>)
}

export default observer(UserProfile)