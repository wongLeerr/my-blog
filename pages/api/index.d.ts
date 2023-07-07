import { IronSession } from 'iron-session'

export type IArticle = {
    id: number,
    title: string,
    content: string,
    create_time: Date,
    update_time: Date,
    views: number,
    is_delete:number
}

export type ISession = IronSession & Record<string,any>