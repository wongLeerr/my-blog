interface ICookieInfo {
    id: number,
    nickname: string,
    avatar: string,
    introduce:string
}

 

// 设置cookies
export const setCookie = (cookies: any, { id, nickname, avatar, introduce }: ICookieInfo) => {
    // 失效时间，24h
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) 
    const path = '/'
    // 设置cookie
    cookies.set('id', id, {
        expires,
        path
    })
    cookies.set('nickname', nickname, {
        expires,
        path
    })
    cookies.set('avatar', avatar, {
        expires,
        path
    })
    cookies.set('introduce', introduce, {
        expires,
        path
    })


}

// 清空 cookies
export const clearCookie = (cookies: any) => {
    // 失效时间，24h
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) 
    const path = '/'
    // 清空cookies
    cookies.set('id', -1, {
        expires,
        path
    })
    cookies.set('nickname', '', {
        expires,
        path
    })
    cookies.set('avatar', '', {
        expires,
        path
    })
    cookies.set('introduce', '', {
        expires,
        path
    })
}