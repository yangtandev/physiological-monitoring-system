const { User, Token } = require('../models/models')
const { getToken, getTokenRenewStatus, createNewToken } = require('../utils/token')

const api = {
    login: async function (ctx) {
        let { username, password } = ctx.request.body

        try {
            let data = await User.findOne({
                attributes: ['username', 'password'],
                where: {
                    username: username,
                    password: password,
                },
                raw: true,
            })

            if (data) {
                ctx.response.body = {
                    status: 'success',
                    code: 200,
                    message: 'login success',
                    token: getToken({ username, password }),
                }
            } else {
                ctx.response.body = {
                    status: 'fail',
                    code: 400,
                    message: 'Parameter error',
                }
            }
        } catch (error) {
            ctx.response.body = error
        }
    },
    checkStatus: async function (ctx) {
        let { token } = ctx.request.body
        try {
            if (getTokenRenewStatus(token)) {
                ctx.response.body = {
                    status: 'success',
                    code: 200,
                    message: 'Token is still alive',
                    token: createNewToken(token),
                }
            } else {
                ctx.response.body = {
                    status: 'fail',
                    code: 400,
                    message: 'Token has been expired',
                }
            }
        } catch (error) {
            ctx.response.body = error
        }
    },
}

module.exports = api
