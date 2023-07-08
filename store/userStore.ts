// 用户信息具体数据类型
export interface IUserInfo {
    userId: number | null,
    nickname: string,
    introduce: string,
    avatar: string,
    // 后来为了解决类型报错加的，前端请用userId指明登录者的身份
    id:number
}

// 仓库保存用户数据类型
export interface IUserStore {
    userInfo: IUserInfo,
    // eslint-disable-next-line no-unused-vars
    setUserInfo:(value:IUserInfo) =>void
}

const userStore = ():IUserStore => {
    return {
        // 用户信息
        userInfo: {
            userId: -1,
            nickname: '',
            introduce: '',
            avatar: '',
            // 后来为了解决类型报错加的，前端请用userId指明登录者的身份
            id:-1
        },
        // 更改用户信息的方法
        setUserInfo: function (value) {
            this.userInfo = value
        }
    }
}  

export default userStore