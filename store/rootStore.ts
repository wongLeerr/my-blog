// 此文件为所有小仓库的整合文件
import userStore, { IUserStore } from "./userStore";

export interface IStore {
    user:IUserStore
}

export default function createStore(initialValue:any): () => IStore {
    return() => {
        return {
            user:{...userStore(),...initialValue?.user}
        }
    }
}