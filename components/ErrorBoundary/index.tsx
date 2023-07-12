import React from "react";
import { FrownOutlined } from '@ant-design/icons'
import styles from './index.module.scss'


class ErrorBoundary extends React.Component {
    
    constructor(props :any) {
        super(props)

        this.state = {
            hasError:false
        }
    }

    static getDerivedStateFromError() {
        return {
            hasError:true
        }
    }

    componentDidCatch(error:any, errorInfo:any) {
        console.log({ error, errorInfo })
    }
    

    render() {
        // 如果有错误，那就渲染下面的页面
        if ((this.state as any).hasError) {
          // You can render any custom fallback UI
          return (
            <div>
            <div className={styles.errorContainer}>
            <FrownOutlined />
            <h1>意外的错误发生了</h1>
            <h2>请刷新重试</h2>
            </div>
        </div>
          )
        }
     
        // Return children components in case of no error
     
        return (this.props as any).children
      }

}

export default ErrorBoundary