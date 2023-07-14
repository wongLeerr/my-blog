// 引入数据库（因为我们要获取文章）
import { prepareConnection } from 'db/index'
import { Article ,Tag} from 'db/entity'
import { IArticle } from './api'
import { Divider } from 'antd'
import styles from './index.module.scss'
import { useState } from 'react'
import classnames from 'classnames';
import dynamic from 'next/dynamic'
// Dynamic import 方法导入ListItem组件，实现该组件的按需加载
const ListItem = dynamic(() => import('components/ListItem'), {
  loading: () => <p>Loading...</p>,
} )

interface ITag {
  id: number;
  title: string;
}

interface IProps {
  articles: IArticle[];
  tags: ITag[];
}

// 服务端渲染
export async function getServerSideProps() {
  // 创建db连接
  const db = await prepareConnection()
  // 获取数据库中的articles表,获取所有的文章
  const articles = await db.getRepository(Article).find({
    // 把关联的用户信息一同返回到这里
    relations: ["user", 'tags']
  })

  const tags = await db.getRepository(Tag).find({
    relations: ['users'],
  });

  // console.log("articles:",articles)

  return {
    props: {
     // 所有文章
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],
    }
  }
  
}

const Home = (props: IProps) => {
  
  const { articles, tags } = props

  const [selectTag, setSelectTag] = useState(0);
  // const [showAricles, setShowAricles] = useState([...articles]);

  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    setSelectTag(Number(tagid));
  };

  return (
    <div>
      <div>
      <div className={styles.tags} onClick={ handleSelectTag }>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id}
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles['active'] : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      </div>
      <div className='content-layout'>
        {
          articles.map((article) => {
            return <div key={article.id}>
              <ListItem article={article}  />
              <Divider />
            </div>
          })
        }
      </div>
    </div>


   
  )
}

export default Home