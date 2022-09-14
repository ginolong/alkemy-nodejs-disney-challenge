import { passport } from '../middleware/auth.middleware.js'
import jwt from 'jsonwebtoken'

const passportAuthToken = passport.authenticate('jwt', { session: false })

const passportAuthRegister = passport.authenticate('register', { session: false })

const passportAuthLogin = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user) => {
            try {
                if (err) return next(err)

                // double check for user
                if (!user) return next(new Error('An error ocurred.'))

                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error)

                        const body = { id: user.id, email: user.email } // no user sensitive information like passwords should be stored in the token
                        const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION  || '8h'  })

                        return res.status(200).json({ message: 'Logged in successfully', token })
                    }
                )
            } catch (error) {
                return next(error)
            }
        }
    )(req, res, next)
}

export { passportAuthToken, passportAuthRegister, passportAuthLogin }