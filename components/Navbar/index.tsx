import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import styles from './index.module.scss'
import { navs } from './config'
import logo from './images/logo.png'
import { Button } from 'antd'
import Login from 'components/Login'
import {useState} from 'react'

const NavBar: NextPage = () => {
    
    const { pathname } = useRouter()
    const [isShowLogin,setIsShowLogin] = useState(false)
    
    // 去写文章
    const goWrite = () => {
       
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

    return (
        // 总导航区域
        <div className={styles.navbar}>
            {/* logo */}
            <section className={styles.logoArea}>
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
                <Button type='primary' onClick={goLogin}>登录</Button>
            </section>
            {/* 登录弹框组件 */}
            <Login isShow={isShowLogin} onClose = {handleClose} />
        </div>
    )
    
}

export default NavBar