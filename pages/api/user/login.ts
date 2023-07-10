import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
// import request from 'service/fetch'
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User,UserAuth } from 'db/entity/index'
import { ISession } from '..'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'


// 登录逻辑:根据用户输入的手机号和验证码 判断用户输入的验证码是否正确 若不正确直接返回错误代码告知用户验证码错误
// 若验证码是正确的，则查询数据库，若此用户（手机号）可在数据库查到，表明为已注册的用户，将用户信息写入session（为了实现判断用户是否处于登录状态）
// ，写入cookie（为了实现前端store的持久化存储（主要指用户信息相关数据）），若为新用户，则执行随机生成用户的昵称，头像，工作，介绍，以及一些关键信息如手机号等
// 等信息写入数据库，表明此用户已经注册了，同时将这些数据写入session和写入cookie和返回给前端数据。
async function login(req: NextApiRequest, res: NextApiResponse) {
    // 定义session，用于实现session存储
    const session: ISession = req.session 
    // 定义cookies对象，用于操作cookie
    const cookies = Cookie.fromApiRoute(req,res)
    // 获取数据库对象，可进行相应数据库的操作
    const db = await prepareConnection()
    // 获取User表和UserAuth表的操作对象
    const userRepo = db.getRepository(User)
    const userAuthRepo = db.getRepository(UserAuth)
    const result =await userRepo.find()
    // console.log("数据库取到的User表",result)
    const { phone, verify, identity_type } = req.body
    // console.log("用户输入的手机号:",phone)
    // console.log("用户输入的验证码:",verify)
    // 用户输入的验证码与后台生成的验证码一致
    if (String(session.verifyCode) === String(verify)) {
        // 查user_auths表，查此表中是否有此人记录
        // 在user_auths表中查找是否有这样一条记录
        const userAuth = await userAuthRepo.findOne({
            // 验证类别为手机号
            identity_type,
            // 手机号的值
            identifier:phone
        }, {
            // 关联表为user表，到时候返回的数据这两个表中相匹配的数据一起返回
            relations:['user']
        })
        // 若查表的结果是成功的，表明此用户为已注册的用户
        if (userAuth) {
            // 从数据库读取用户的基本信息
            const user = userAuth.user
            const { id, nickname, avatar, introduce } = user
            // 将这些信息存储至session中
            session.userId = id
            session.nickname = nickname
            session.avatar = avatar
            session.introduce = introduce
            await session.save()
            // 将基本信息保存至cookie中
            setCookie(cookies,{id,nickname,avatar,introduce})
            // 将用户信息返回给前端
            res?.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar,
                    introduce
                }
            })
            // console.log("此用户已注册")
        } else {
            // 表明该用户还未注册，完成注册操作（其实就是写入数据库该用户的一些信息）
            // 对用户信息基本表进行写入一些初始化信息
            const user = new User()
            // 随机生成用户昵称
            user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
            user.avatar = '/images/avatar.jpg'
            user.job = '暂无'
            user.introduce = '暂无'

            // 对用户私密信息表进行写入一条操作
            const userAuth = new UserAuth()
            userAuth.identifier = phone
            userAuth.identity_type = identity_type
            userAuth.credential = session.verifyCode
            // 完成表的关联
            userAuth.user = user   
            // 由于设置了级联，因此对 UserAuth 表进行保存操作同样会使得User表得到保存
            await userAuthRepo.save(userAuth)
            const { user: { id, nickname, avatar, introduce } } = userAuth
             // 将这些信息存储至session中
             session.userId = id
             session.nickname = nickname
             session.avatar = avatar
             session.introduce = introduce
             await session.save()
            // 将基本信息保存至cookie中
            setCookie(cookies,{id,nickname,avatar,introduce})
            // 将用户信息返回给前端
            res?.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar,
                    introduce
                }
            })
        }
    } else {
        // 用户输入的验证码错误，即用户输入的与后端生成的不匹配
        res?.status(200).json({
            code: -1,
            msg:'验证码错误'
        })
    }
}



export default withIronSessionApiRoute(login, ironOptions)