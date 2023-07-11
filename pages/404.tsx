import styles from './index.module.scss'
import { Button } from 'antd'
import { CaretLeftOutlined } from '@ant-design/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Custom404() {

    const { push } = useRouter()

    const handleClick = () => {
        push('/')
    }

    return <div className={styles.container}>
    <div className={styles.page404Container}>
    <section className={styles.left}>
        <h1 className={styles.title}>啊哦，出错啦 ~ 这个页面没有找到</h1>
        <section className={styles.errCode}>Error code：404</section>
        <section className={styles.navigator}>现在你可以尝试回到主页：<Button type='primary' onClick={handleClick}><CaretLeftOutlined />Home</Button></section>
    </section>
    <section className={styles.right}>
        <Image src="/images/404.jpg" alt='404' width={400} height={400} />
    </section>
</div>
</div>
}
