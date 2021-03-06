const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const router = new Router()

router.post('/registration',
    [
        check('email, "Uncorrect email').isEmail(),
        check('password', "Password must be longer than 3 and shorter than 12").isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {

        try {
            //если errors не пустая(выше параметры валидации в масиве), значит есть ошибки, вернуть код 400
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Uncorrect request", errors })
            }

            //одержуєм емеіл і пароль з тіла запросу
            const { email, password } = req.body

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: `User with email ${email} already exist` })
            }
            const hashPassword = bcrypt.hash(password, 7)
            const user = new User({ email, password: hashPassword })
            await user.save()
            return res.json({ message: 'User was created' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    })

router.post('/login',
    async (req, res) => {

        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            //порівнює не зашифрований пароль з зашифрованим
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token, 
                user: {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    })

module.exports = router