import styles from './index.module.scss'
import { GithubOutlined ,WechatOutlined} from '@ant-design/icons'

const Author = () => (
    <div className={styles.container}>
        <h3 className={styles.title}>作者简介</h3>
        <div className={styles.introduce}>
            大家好，我是 WongLeer，两年前我开始自学前端，现在有一年前端实习经验。
            <div>技术栈：JavaScript(ES6) + HTML5 + CSS3 + Vue + React + Node + Uni-app + TypeScript</div>
        </div>
        
        <h3  className={styles.title}>作者的 CSDN 和 Github</h3>
        <div className={styles.middle}>
            <section className={styles.csdn}>
                <div><span className={styles.innerCSDN}>CSDN</span>：<a href="https://blog.csdn.net/weixin_51431277" className={styles.link} target="_blank">去往他的 CSDN 博客</a></div>
            </section>
            <section className={styles.github}>
                <GithubOutlined className={styles.innnerIcon} />： <a href="https://github.com/wongLeerr" className={styles.link} target="_blank">去往他的 Github</a>
            </section>
        </div>
        <h3  className={styles.title}>联系作者</h3>
        <div className={styles.bottom}>
            <WechatOutlined /> <span className={styles.wechat}>：WongLeerAres</span>
            <div className={styles.emailInfo}>
                <span>email</span>：<span>wongleer@163.com</span>
            </div>
        </div>
    </div>
)

export default Author