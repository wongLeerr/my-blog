import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import styles from './index.module.scss'
import { navs } from './config'
import logo from './images/logo.png'
import { Button, Dropdown, Avatar, message } from 'antd'
import type { MenuProps } from 'antd';
import {HomeOutlined,LoginOutlined} from '@ant-design/icons'
import Login from 'components/Login'
import {  useState } from 'react'
import { useStore } from 'store'
import request from 'service/fetch'
import { observer } from 'mobx-react-lite'

const NavBar: NextPage = () => {
    
    const store = useStore()
    const { userId, avatar } = store.user.userInfo
    // console.log("userId:",userId)
    console.log("avatar:",avatar)

    const router = useRouter()
    const { pathname , push } = router
    const [isShowLogin,setIsShowLogin] = useState(false)
    
    // 去写文章
    const goWrite = () => {
        // console.log("当前的useId为:",userId)
         // 未登录
         if (!userId || userId == -1) {
            message.warning("不登录还想写文章撒~")
         } else {
            // 跳转至写文章页
            push('/editor/new')
        } 
    }

    // 去登录
    const goLogin = () => {
        // 展示登录弹出框
        setIsShowLogin(true)
    }

    // 处理登录弹框组件触发关闭的回调
    const handleClose = () => {
        // 关闭登录弹出框
        setIsShowLogin(false)
        
    }
    // 去个人主页
    const handleGotoPersonalPage = () => {
        // 每个用户都有自己的独特的主页撒
        push(`/user/${userId}`)
    }

    // 退出登录
    const handleLogout = () => {
        request.post("/api/user/logout", {})
            .then((res: any) => {
                // 调用退出登录的接口成功
                if (res?.code === 0) {
                    // 置空仓库中关于用户相关信息
                    store.user.setUserInfo({
                        userId: -1,
                        introduce: '',
                        avatar: '',
                        nickname: '',
                        id:-1
                    })
                    message.success("已退出登录")
                }
            }, (err) => {
                message.error(err || "未知错误")
            }
        )
    }

    // 点击logo
    const handleClickLogo = () => {
        push('/')
    }

    // 定义鼠标悬浮头像时弹出的下拉框选项
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
           <div onClick={handleGotoPersonalPage}> <HomeOutlined />  个人主页</div>
          ),
        },
        {
          key: '2',
          label: (
            <div onClick={handleLogout}> <LoginOutlined />  退出登录</div>
          ),
        },
    ];
    
    return (
        // 总导航区域
        <div className={styles.navbar}>
            {/* logo */}
            <section className={styles.logoArea} onClick={handleClickLogo}>
                <Image title='logo' className={styles.logo} src={logo} alt='logo'></Image>
            </section>
            {/* 首页、咨询、标签导航 */}
            <section className={styles.linkArea}>
                {
                    navs?.map((item) => {
                        return (
                        <Link href={item.value} key={item.value}>
                            <span className={pathname === item.value ? styles.active : ""}>{ item.label}</span>
                        </Link>
                        )
                        
                    })
                }
            </section>
            {/* 写文章、登录按钮 */}
            <section className={styles.operationArea}>
                <Button onClick={goWrite}>写文章</Button>
                {
                    !userId || userId == -1 ? (
                        ( <Button type='primary' onClick={goLogin}>登录</Button>)
                       
                    ) : (
                        <>
                        <Dropdown menu={{items}} placement='bottomLeft'>
                            <Avatar src={avatar} size={32} />
                        </Dropdown>
                        </>)
                }
               
            </section>
            {/* 登录弹框组件 */}
            <Login isShow={isShowLogin} onClose = {handleClose} />
        </div>
    )
    
}

// 使用observer将组件包裹起来，使得该组件拥有响应式的能力（store中数据变化，立即响应到UI上）
export default observer(NavBar)