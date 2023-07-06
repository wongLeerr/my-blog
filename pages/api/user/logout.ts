import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ISession } from '..'
import { Cookie } from 'next-cookie'
import { ironOptions } from 'config/index'
import { clearCookie } from 'utils'

// 退出登录 -> 清空session ,清空cookie
async function logout(req: NextApiRequest, res: NextApiResponse) { 
    // 获取session 和 cookies
    const session:ISession = req.session
    const cookies = Cookie.fromApiRoute(req, res)
    
    // 清空服务端session环境
    await session.destroy()

    // 清空cookies
    clearCookie(cookies)

    // 响应前端
    res.status(200).json({
        code: 0,
        msg: "退出成功",
        data:{}
    })
}

export default withIronSessionApiRoute(logout, ironOptions)