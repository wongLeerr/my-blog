import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import styles from './index.module.scss'
import { navs } from './config'
import logo from './images/logo.png'

const NavBar: NextPage = () => {
    
    const {pathname} = useRouter()

    return (
        <div className={styles.navbar}>
            <section className={styles.logoArea}>
                <Image title='logo' className={styles.logo} src={logo} alt='logo'></Image>
            </section>
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
        </div>
    )
    
}

export default NavBar