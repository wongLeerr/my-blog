// 此文件用于对API接口文件中返回的成功或者失败的响应状态码和消息做统一化管理

// 用户管理
export const EXCEPTION_USER = {
    NOT_LOGIN: {
        code: 1001,
        msg:'未登录还想做什么'
    },
    NOT_FOUND: {
        code: 1001,
        msg:'未找到此用户'
    },
    MODIFY_ERROR: {
        code: 1001,
        msg:'修改信息失败'
    }
}

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

// 评论管理
export const EXCEPTION_COMMENT= {
    PUBLISH_FAILED: {
        code: 2001,
        msg:'发布评论失败'
    },
}

// 标签管理
export const EXCEPTION_TAG= {
    GET_TAG_FAILED: {
        code: 2001,
        msg:'获取标签失败'
    },
    UPDATE_TAG_FAILED: {
        code: 2001,
        msg:'关注/取关失败'
    }
}



