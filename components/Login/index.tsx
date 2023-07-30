import styles from './index.module.scss'
import Image from 'next/image';
import { useState } from 'react'
import {message}  from 'antd'
import github from './images/github.png'
import CountDown from 'components/CountDown'
import request from 'service/fetch';
import { useStore } from 'store'
import { observer } from 'mobx-react-lite';

interface IProps {
    isShow: boolean;
    onClose:Function
}

const Login = ({ isShow, onClose }: IProps) => {

    const store = useStore()
    // console.log(store)

    const [form, setForm] = useState({
        phone: '',
        verify:''
    })

    const [isShowVerifyCode,setIsShowVerifyCode] = useState(false)

    // 关闭弹框
    const handleClose = () => {
        onClose()
    }

    // 获取验证码
    const handleGetVerifyCode = () => {
        // 若用户未填写手机号就点击获取验证码
        if (!form?.phone) {
            message.warning("请输入手机号")
            return 
        }   

        request.post("/api/user/sendVerifyCode", {
            to: form?.phone,
            appId:"2c94811c88bf35030188ec8788e90c18",
            templateId: 1,
        }).then((res:any) => {
            if (res.code === 0) {
             setIsShowVerifyCode(true)
            } else {
                message.error(res.msg || "未知错误")
          }
        })
    }

    // 登录
    const handleLogin = () => {
        request.post("/api/user/login", {
            // 用户输入的手机号和验证码以及验证类型为手机 这些信息带给后端
            ...form,
            identity_type:'phone'
        }).then((res:any) => {
            if (res?.code === 0) {
                // 登录成功
                message.success("登录成功")
                // 将信息存储至store中
                store.user.setUserInfo(res?.data)
                onClose && onClose()
            } else {
                message.error(res?.msg || "未知错误")
            }
        }, (error) => {
            message.error(error)
        })
     }
    // client-id : 0545ab062874714f889d
    // client-secret : 95f9850b23539b74a507bb1694955badf0f11832
    // github 登录 (基于OAuth2.0协议)
    const handleOtherLogin = () => {
        const githubClientId = '0545ab062874714f889d'
        const redirectUrl = 'http://localhost:3000/api/oauth/redirect'
        // 新开一个页面，跳转至 github 以决定是否将github登录权限授予给当前网站，同意授权或者不同意授权都将跳转至我们指定的地址
        window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUrl}`)
     }
    
    // 输入手机号
    const handleFormChange = (e:any) => {
        const { name, value } = e?.target || {}
        setForm({
            ...form,
            [name]:value
        })
    }
    // 输入验证码回车
    const handleKeyUp = (e:any) => {
        // 判定为回车
        if (e.keyCode === 13) {
            // 执行登录操作
            handleLogin()
        }
    }

    // 倒计时组件触发关闭的回调
    const handleCountDownEnd = () => {
        setIsShowVerifyCode(false)
    }

    return (
        isShow ?
            (
                <div className={styles.loginArea}>
                    <section className={styles.loginBox}>
                        <div className={styles.loginTitle}>
                            <div>手机号登录</div>
                            <span className={styles.closeBtn} onClick={handleClose}>x</span>
                        </div>
                        <input name='phone' value={form.phone} type="text" placeholder='请输入手机号' onChange={handleFormChange} />
                        <section className={styles.verifyCodeArea}>
                            <input name='verify' value={form.verify} type="text" placeholder='请输入验证码' onKeyUp={handleKeyUp} onChange={handleFormChange} />
                            {/* 根据falg决定显示倒计时组件还是获取验证码按钮 */}
                            <span className={styles.getVerifyCode} onClick={handleGetVerifyCode}>
                                {
                                    isShowVerifyCode ? <CountDown time={9} onEnd={handleCountDownEnd} /> : "获取验证码"
                                }
                            </span>
                        </section>
                        <div className={styles.loginBtn} onClick={handleLogin}>登录</div>
                        <div className={styles.otherLogin} onClick={handleOtherLogin}>使用 Github 登录 <Image src={github} alt='github' className={styles.github} ></Image></div>
                        <div className={styles.loginPrivacy}>注册登录即表示同意 <a href="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/juejin/86857833-55f6-4d9e-9897-45cfe9a42be4.html" target="_blank">用户协议</a> 和 <a href="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/juejin/7b28b328-1ae4-4781-8d46-430fef1b872e.html" target="_blank">隐私政策</a></div>
                    </section>
                </div>
            ) : null
    )
}

export default observer(Login) 