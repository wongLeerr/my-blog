// 此文件为配置连接数据库和配置以js方式操作数据库的文件
import "reflect-metadata" 
import {User,UserAuth,Article,Comment} from './entity/index'
const host = process.env.DATABASE_HOST
const port = Number(process.env.DATABASE_PORT)
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

import {getConnection ,createConnection, Connection} from 'typeorm'

let connetReadyPromise: Promise<Connection> | null=null;

export const prepareConnection = () => {
    if (!connetReadyPromise) {
        connetReadyPromise = (async () => {
            // 连接数据库操作
            try {
                const staleConnection = getConnection()
                await staleConnection.close()
            } catch (err) {
                console.log(err)
            }
            // 创建连接数据库的connection实例
            const connection = await createConnection({
                type:'mysql',
                host,
                port,
                username,
                password,
                database,
                // 数据库和typeorm库的映射关系，entity文件夹中每一个ts文件代表数据库中的每一个表
                entities: [User,UserAuth,Article,Comment],
                synchronize: false,
                logging:true
            })

            return connection
        })()
    }


    return connetReadyPromise
}