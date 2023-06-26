import { NextApiRequest,NextApiResponse } from 'next'
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import request from 'service/fetch'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { ISession } from '..'

// 求助iron-session库，使用withIronSessionApiRoute包裹的函数拥有保存session数据的能力
export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
    // 定义session，用于将验证码保存至内存中
    const session:ISession = req.session 
    // 容联云平台获取
    const AccountId = "2c94811c88bf35030188ec8787920c11"
    const AuthToken = "36ea857842514a55b416f2dc06443e3e"
    // 求助于date-fns库实现将时间戳转为yyyyMMddHHmmss格式
    const nowDate = format(new Date(), "yyyyMMddHHmmss")
    // 求助于md5库实现md5加密
    const SigParameter = md5(`${AccountId}${AuthToken}${nowDate}`).toUpperCase()
    console.log(SigParameter)
    const Authorization = encode(`${AccountId}:${nowDate}`)
    // 构造验证码和过期时间
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000  // 生成 1000-9999的四位整数
    const expireMinute = '5'
    // 请求路径和参数
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`
    // 发post请求携带请求体以及请求头
    const response =await request.post(url, {
        ...req.body,
        datas:[verifyCode,expireMinute]
    }, {
        headers: {
            Authorization
        }
    })
    const { statusCode, statusMsg,templateSMS } = response as any
    if (statusCode == '000000') {
         // 存到session之后要进行保存
        session.verifyCode = verifyCode
        await session.save()
        res.status(200).json({
            code: 0,
            msg: statusMsg,
            templateSMS
        })
     } else {
        res.status(200).json({
            code: statusCode,
            msg:statusMsg
        })
     }
     
    

   
}