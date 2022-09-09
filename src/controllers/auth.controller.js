import { passportAuthRegister, passportAuthLogin } from '../services/auth.service.js'
export const authLogin = async (req, res, next) => {
    await passportAuthLogin(req, res, next)
}

export const authRegister = async (req, res, next) => {
    await passportAuthRegister(req, res, next)
    // TODO send welcome email
}

