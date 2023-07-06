import '../styles/globals.css'
import  Head  from 'next/head'
import Layout from 'components/Layout'
import { StoreProvider } from 'store'
import { NextPage } from 'next'

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps:any
}

const MyApp = ({ initialValue, Component, pageProps }: IProps) => {
  
  // 根据要渲染的组件身上的layout属性是否为null，来决定是否渲染layout，也就是页头和页脚
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return (
        <div>
          <Head>
          <title>博客系统</title>
          </Head>
          <Component {...pageProps} />
        </div>
      )
    } else {
      return (<Layout>
        <Head>
          <title>博客系统</title>
        </Head>
          <Component {...pageProps} />
        </Layout>)
    }
  }

  return (
    <StoreProvider initialValue={initialValue}>
      {/* <Layout>
      <Head>
        <title>博客系统</title>
      </Head>
        <Component {...pageProps} />
      </Layout> */}
      { renderLayout() }
    </StoreProvider>
    )
}

// 下面这个函数在服务端执行
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  // 获取有用的cookie信息
  const { id, nickname, avatar, introduce } = ctx?.req?.cookies || {}
  // 将此信息以props的形式注入MyApp组件中
  return {
    initialValue: {
      user: {
        userInfo: {
          userId:id,
          nickname,
          avatar,
          introduce
        }
      }
    }
  }
}

export default MyApp
