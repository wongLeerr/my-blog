// 引入数据库（因为我们要获取文章）
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity'
import ListItem from 'components/ListItem'
import { IArticle } from './api'
import { Divider } from 'antd'



interface IProps {
  articles:IArticle[]
}

// 服务端渲染
export async function getServerSideProps() {
  // 创建db连接
  const db = await prepareConnection()
  // 获取数据库中的articles表,获取所有的文章
  const articles = await db.getRepository(Article).find({
    // 把关联的用户信息一同返回到这里
    relations: ["user"]
  })

  console.log("articles:",articles)

  return {
    props: {
     // 所有文章
     articles:JSON.parse(JSON.stringify(articles))
    }
  }
  
}

const Home = (props: IProps) => {
  
  const { articles } = props
  console.log("articles:",articles)

  return (
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
  )
}

export default Home