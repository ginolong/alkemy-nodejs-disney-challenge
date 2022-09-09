import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

/* TODO Error handling, strategies don't reflect the exact errors */

// Check JWT
const passportAuthToken = passport.authenticate('jwt', { session: false })

passport.use(
    new JwtStrategy(
        {
            secretOrKey: 'ALKEMY_CHALLENGE', // use env var?
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('user_token')
        },
        async (token, done) => {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        }
    )
)

// Register
const passportAuthRegister = passport.authenticate('register', { session: false })

passport.use(
    'register',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.create({ email, password })
                return done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)


// Login
const passportAuthLogin = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.')

                    return next(error)
                }

                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error)

                        const body = { id: user.id, email: user.email }
                        const token = jwt.sign({ user: body }, 'ALKEMY_CHALLENGE') // env var?

                        return res.json({ token })
                    }
                )
            } catch (error) {
                return next(error)
            }
        }
    )(req, res, next)
}

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email: email } })
                
                if (!user) {
                    return done(null, false, { message: 'User not found' })
                }

                const validate = await user.isValidPassword(password)

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' })
                }

                return done(null, user, { message: 'Logged in Successfully' })
            } catch (error) {
                return done(error)
            }
        }
    )
)

export { passport, passportAuthToken, passportAuthRegister, passportAuthLogin }