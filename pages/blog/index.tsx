import { Tabs } from 'antd'
import styles from './index.module.scss'
import Author from 'components/Author'
import Blog from 'components/Blog'

// SSG
export async function getStaticProps() {
    return {
        props:{}
    }
}

const items = [
    {
      key: '1',
      label: `关于作者`,
      children:<Author />,
    },
    {
      key: '2',
      label: `关于博客系统`,
      children: <Blog />,
    }
  ];

const AboutBlog = () => (

    

    <div className='content-layout'>
        <div className={styles.container}>
        <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
    </div>
)

export default AboutBlog