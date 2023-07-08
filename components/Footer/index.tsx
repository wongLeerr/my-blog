import type { NextPage } from 'next'
import styles from './index.module.scss'

const Footer:NextPage = () => {
    return (
        <div className={styles.footer}>
            Next.js + SSR 服务端渲染博客系统解决方案
        </div>
    )
    
}

export default Footer