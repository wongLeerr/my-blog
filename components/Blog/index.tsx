import styles from './index.module.scss'

const Blog = () => (
    <div className={styles.container}>
        <h3 className={styles.title}>创建博客的初衷</h3>
        <div className={styles.introduce}>
            大概在去年六月中旬，当时要上报毕设课题，我就想着使用自己的技术栈来做一个
            博客系统，当时我对 NextJs 服务端渲染并不是很熟悉，而且当时React属于入门水平，我就一边学习，一边
            来动手实战这个博客系统项目，历时三个月，不断对项目进行缝缝补补和优化，才诞生了这个博客系统，目前该系统已上线。
        </div>
        <h3 className={styles.title}>所用技术</h3>
        <div className={styles.techStack}>
            <ul>
                <li className={styles.title}>Next.js: 服务端渲染框架</li>
                <div>Why Next.js ? </div>
                <div>
                    <ul>
                        <li>更好的SEO</li>
                        <li>更快的首屏加载速度</li>
                    </ul>
                </div>
                <li className={styles.title}>React: 专注前端 UI 的 JavaScript 框架</li>
                <li className={styles.title}>TypeScript: JavaScript的超集</li>
                <li className={styles.title}>Node: JavaScript 宿主环境, 用于实现服务端</li>
                <li className={styles.title}>MySQL: 轻量级关系型数据库</li>
                <li className={styles.title}>Typeorm: 用于支持使用 JavaScript 语法操作 MySQL</li>
                <li className={styles.title}>Antd: 基于 React 的 UI 组件库</li>
                <li className={styles.title}>Vercel: 使用 Vercel 完成线上环境发布, 实现本地推送代码触发自动部署</li>
                <div>Why Vercel ? </div>
                <div>
                    <ul>
                        <li>优雅的实现项目的自动化部署</li>
                        <li>更方便的检测项目性能指标及反馈</li>
                    </ul>
                </div>
            </ul>
        </div>
        <h3 className={styles.title}>线上域名</h3>
        <div className={styles.url}>
                https://my-blog-two-sage.vercel.app
        </div>
    </div>
)

export default Blog