import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import User from '../models/user.model.js'

// Check JWT
passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
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
                    const error = new Error('User not found')
                    error.status = 404
                    throw error
                }

                const validate = await user.isValidPassword(password)
                if (!validate) {
                    const error = new Error('Wrong password')
                    error.status = 401
                    throw error
                }

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    )
)

export { passport }