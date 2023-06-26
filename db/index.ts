import "reflect-metadata" 
import {getConnection } from 'typeorm'

let connetReadyPromise: any

export const prepareConnection = () => {
    if (!connetReadyPromise) {
        connetReadyPromise(async () => {
            // 连接数据库操作
            try {
                const staleConnection = getConnection()
                await staleConnection.close()
            } catch (err) {
                console.log(err)
            }
        })()
    }

}