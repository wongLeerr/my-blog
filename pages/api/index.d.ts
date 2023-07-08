import { IronSession } from 'iron-session'
import { IUserInfo } from 'store/userStore'

export type IArticle = {
    id: number,
    title: string,
    content: string,
    create_time: Date,
    update_time: Date,
    views: number,
    is_delete: number,
    user: IUserInfo,
    comments:IComment[]
}

export type IComment = {
    id: number,
    content: string,
    create_time: Date,
    update_time: Date,
    // user: IUserInfo,
    // article:IArticle
}

export type ISession = IronSession & Record<string,any>