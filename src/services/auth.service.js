import { passport } from '../middleware/auth.middleware.js'
import jwt from 'jsonwebtoken'
import { sendWelcomeMail } from '../services/email.service.js'

const passportAuthToken = passport.authenticate('jwt', { session: false })

const passportAuthRegister = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            const error = new Error('Both email and password are necessary to register')
            error.status = 400
            throw (error)
        }
        passport.authenticate(
            'register',
            { session: false },
            async (err, user) => {
                try {

                    // check sequelize validation errors, and format according to error handler
                    if (err) {
                        const errObj = {}
                        if (err.errors) {
                            err.errors.map(er => {
                                errObj[er.path] = er.message;
                            })
                            err.message = errObj
                            err.status = 400
                        }
                        return next(err)
                    }

                    // double check for user
                    if (!user) return next(new Error('Something wen\'t wrong with the registration process.'))

                    // send welcome email if registration was successful
                    sendWelcomeMail(user.email) 

                    // login after successful register
                    passportAuthLogin(req, res, next)
                } catch (error) {
                    return next(error)
                }
            }
        )(req, res, next)
    } catch (error) {
        next(error)
    }
}

const passportAuthLogin = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            const error = new Error('Both email and password are necessary to login')
            error.status = 400
            throw (error)
        }
        passport.authenticate(
            'login',
            { session: false },
            async (err, user) => {
                try {
                    if (err) return next(err)

                    // double check for user
                    if (!user) return next(new Error('An error ocurred during login.'))

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error)

                            // no user sensitive information like passwords should be stored in the token
                            const body = { id: user.id, email: user.email } 
                            const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION || '8h' })

                            return res.status(200).json({ user: user.email, message: 'Logged in successfully', token })
                        }
                    )
                } catch (error) {
                    return next(error)
                }
            }
        )(req, res, next)
    } catch (error) {
        next(error)
    }
}

export { passportAuthToken, passportAuthRegister, passportAuthLogin }