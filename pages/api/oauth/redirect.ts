import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
// import request from 'service/fetch'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User,UserAuth } from 'db/entity/index'
import { ISession } from '..'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'
import request from 'service/fetch'

 // client-id : 0545ab062874714f889d
 // client-secret : 95f9850b23539b74a507bb1694955badf0f11832

async function redirect(req: NextApiRequest, res: NextApiResponse) { 
    const session: ISession = req.session
    
    // 回调的路由 : http://localhost/api/oauth/redirect?code=xxx （会命中此文件）
    const { code } = req?.query
    console.log('ccccccccccccccccccccccode:', code)
    
    // github 为我们生成的
    const githubClientId = '0545ab062874714f889d'
    const githubClientSecret = '95f9850b23539b74a507bb1694955badf0f11832'

    // 约定访问的地址以及传递必要的参数过去
    const url = `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${code}`
    // 后端请求 github 请求将token给我
    const result = await request.post(url, {}, {
        headers: {
            accept:'application/json'
        }
    })
    console.log('rrrrrrrrrrrrrrrrrresult:',result)

    const { access_token } = result as any

    console.log('ttttttttttttttttttoken:', access_token)
    
    // 后端拿到令牌之后就可以向github请求用户信息了
    const githubUserInfo = await request.get('https://api.github.com/user', {
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    })
    console.log('gggggggggggggggggggithubUserInfo:', githubUserInfo)
    
    // 定义cookies对象，用于操作cookie
    const cookies = Cookie.fromApiRoute(req, res)
    
    // 建立 db 连接
    const db = await prepareConnection()
    // 在UserAuth表中查找是否有这一条数据，如果有那就证明此用户并非新用户，直接更新当前用户数据即可
    // 如果找不到表明当前用户为新的用户，直接插入一条数据即可
    const userAuth = await db.getRepository(UserAuth).findOne({
        identity_type: 'github',
        identifier:githubClientId
    }, {
        relations:['user']
    })

    if (userAuth) {
        const user = userAuth.user
        const { id, nickname, avatar ,introduce} = user
        
        userAuth.credential = access_token
        // 将这些信息存储至session中
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        session.introduce = introduce
        await session.save()
        // 将基本信息保存至cookie中
        setCookie(cookies, { id, nickname, avatar, introduce })
        // res?.status(200).json({
        //     code: 0,
        //     msg: '登录成功',
        //     data: {
        //         userId: id,
        //         nickname,
        //         avatar,
        //         introduce
        //     }
        // })
        // 重定向至首页
        res.writeHead(302, {
            Location:'/'
        })

    } else {
        // 将github中相关用户信息存储至db
        const { login = '', avatar_url = '' } = githubUserInfo as any
        const user = new User()
        user.nickname = login
        user.avatar = avatar_url

        const userAuth = new UserAuth()
        userAuth.identity_type = 'github'
        userAuth.identifier = githubClientId
        userAuth.credential = access_token
        userAuth.user = user
        const userAuthRepo = db.getRepository(UserAuth)
        const resUserAuth = await userAuthRepo.save(userAuth)

        console.log('rrrrrrrrrrrrrrresUserAuth:',resUserAuth)
        const { id, nickname, avatar } = resUserAuth?.user
        // 将这些信息存储至session中
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        session.introduce = '此人很懒,什么都没留下' 
        await session.save()
        // 将基本信息保存至cookie中
        setCookie(cookies, { id, nickname, avatar, introduce: '此人很懒,什么都没留下' })
        // res?.status(200).json({
        //     code: 0,
        //     msg: '登录成功',
        //     data: {
        //         userId: id,
        //         nickname,
        //         avatar,
        //         introduce:'此人很懒,什么都没留下'
        //     }
        // })
         // 重定向至首页
         res.writeHead(302, {
            Location:'/'
        })

        // res.status(200).json({
        //     code: 0,
        //     msg: '登录成功',
        //     data: {
        //         userId: id,
        //         nickname,
        //         avatar
        //     }
        // })
    }

   
}

export default withIronSessionApiRoute(redirect, ironOptions)