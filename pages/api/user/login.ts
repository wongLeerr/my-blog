import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
// import request from 'service/fetch'
import { ironOptions } from 'config/index'


export default withIronSessionApiRoute(login, ironOptions)

async function login(req: NextApiRequest, res: NextApiResponse) {
    const { phone, verify } = req.body
    console.log(phone)
    console.log(verify)
    res?.status(200).json({
        code:0
    })
}
