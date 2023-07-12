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
        <h1 className={styles.title}>服务器开小差了~</h1>
        <section className={styles.tryAgain}>尝试刷新试试</section>
    </section>
    <section className={styles.right}>
        <Image src="/images/500.jpg" alt='404' width={600} height={400} />
    </section>
</div>
</div>
}
