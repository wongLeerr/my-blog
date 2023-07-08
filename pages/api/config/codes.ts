// 此文件用于对API接口文件中返回的成功或者失败的响应状态码和消息做统一化管理

// 用户管理
export const EXCEPTION_USER = {}

// 文章管理
export const EXCEPTION_ARTICLE = {
    PUBLISH_FAILED: {
        code: 2001,
        msg:'发布文章失败'
    },
    UPDATE_FAILED: {
        code: 2002,
        msg:'更新文章失败'
    },
    NOT_FOUND: {
        code: 2003,
        msg:'未找到此文章?'
    },
}




