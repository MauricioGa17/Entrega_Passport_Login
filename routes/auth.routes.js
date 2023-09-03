import Router from 'express'
import passport from 'passport';

//Models
import userModel from '../models/user.model.js'

const router = Router();

//Recibe los datos para el login
router.post('/login-local', passport.authenticate('local', { failureRedirect: '/' }), async (req, res) => {

    if(!req.user){ 
        return res.status.send('Credenciales Invalidas');
    }

    res.cookie('keyCookieForJWT', req.user.token).redirect('/profile');
})

router.get('/login-github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    return res.redirect('/profile') 
})

router.post('/logout', async (req, res) => {

    res.clearCookie("keyCookieForJWT");

    return res.redirect('/') 
})

export default router;