import styles from './index.module.scss'
import Image from 'next/image';
import { useState } from 'react'
import github from './images/github.png'
import CountDown from 'components/CountDown'

interface IProps {
    isShow: boolean;
    onClose:Function
}

const Login = ({ isShow, onClose }: IProps) => {

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
        setForm
        setIsShowVerifyCode(true)
    }

    // 登录
    const handleLogin = () => { }
    
    // github 登录 (基于OAuth2.0协议)
    const handleOtherLogin = () => { }
    
    // 输入手机号
    const handleFormChange = (e:any) => {
        const { name, value } = e?.target || {}
        setForm({
            ...form,
            [name]:value
        })
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
                            <input name='verify' value={form.verify} type="text" placeholder='请输入验证码' onChange={handleFormChange} />
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

export default Login