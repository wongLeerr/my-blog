// 此文件用于支持将 store 通过 provider 形式传递给各个组件
import React, { ReactElement, createContext, useContext } from "react";
import { useLocalObservable, enableStaticRendering } from "mobx-react-lite";
import createStore,{IStore} from "./rootStore";


interface IProps{
    initialValue: Record<any, any>,
    children:ReactElement
}

// SSR 项目需根据环境（node or browser）将下面函数传入true
enableStaticRendering(!process.browser)

const StoreContext  =  createContext({})


export const StoreProvider = (props: IProps) => {
    // 创建store
    const store:IStore = useLocalObservable(createStore(props.initialValue))
    return (
        <StoreContext.Provider value={ store }>{ props.children}</StoreContext.Provider>
    )

}

// 提供一个自定义 hook,支持在组件中获取store信息
export const  useStore = () => {
    const store: IStore = useContext(StoreContext) as IStore
    if (!store) {
        throw new Error("数据不存在")    
    }
    return store
}