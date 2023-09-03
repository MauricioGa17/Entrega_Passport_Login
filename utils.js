import { fileURLToPath } from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

//Genera el JSON Token
export const generateToken = (user) => {
    return jwt.sign({ user }, 'secretForJWT', {expiresIn: '24h'});
}

//Extrae la cookie del request
export const extractCookie = (req) => {
    return (req && req.cookies) ? req.cookies['keyCookieForJWT'] : null
}

//Encriotar la contraseña
export const onHashPassword = (password) => {
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    return hashPassword;
}

export const onValidatePassword = (password, userPassword) => {
    const validate = bcrypt.compareSync(password, userPassword); // true
    return validate;
}