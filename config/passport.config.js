import passport from 'passport'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import passportJWT, { ExtractJwt } from 'passport-jwt'

//Generacion de token
import { extractCookie, generateToken, onHashPassword, onValidatePassword } from '../utils.js'

//Models
import userModel from '../models/user.model.js'

const JWTStrategy = passportJWT.Strategy;
const JWTExtract = passportJWT.ExtractJwt

//login Local
const LocalStrategy = local.Strategy;

const initializePassport = () => {

    //Login Local
    passport.use('local', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            let userInfo = await userModel.findOne({ email: username }).lean().exec();
            if(!userInfo){
                //usuario no existe
                return done(null, false)
            }

            //validar Password
            const confirmPassword = onValidatePassword(password, userInfo.password)
            if(confirmPassword == false){
                console.log("Contraseña incorrecta")
                return done(null, false)
            }

            //generar el cookie de session
            const token = generateToken(userInfo);
            userInfo.token = token;

            return done(null, userInfo);
        } catch (error) {
            console.log("Error local: " + error)
            return done(null, false);
        }
    }));

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body;
        try {
            
            const user = await userModel.findOne({ email: username }).lean().exec();

            if(user){
                console.log("El usuario ya existe");
                console.log(user)
                return done(null, false)
            }

            const hashPassword = onHashPassword(password);
        
            const newUser = {
                "first_name": first_name,
                "last_name": last_name,
                "age": age,
                "email": email,
                "password": hashPassword
            }

            const result = await userModel.create(newUser);
            return done(null, result)
        } catch (error) {
            return done("Error al registrar el usuario" + error);
        }
    }))

    //Realizar el login con github
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.3bb97cd7c791869d',
        clientSecret: 'ca7fcde47b637c7522a80db8195ee47decafb1ca',
        callbackURL: 'http://localhost:8080/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {

        console.log(profile);

        try {
            const email = profile._json.email;
            const user = await userModel.findOne({ email: email })

            //Si existe el usuario
            if(user){
                const token = generateToken(user);
                console.log("El usuario" + user)
                user.token = token;
    
                return done(null, user);
            }else{
                console.log("Usuario no existe");
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    password: '',
                    social: 'github',
                    role: 'user',
                    age: ''

                }
                
                const result = await userModel.create(newUser);
                
                const token = generateToken(result);
                result.token = token;

                return done(null, result);
            }
        } catch (error) {
            return done('Ocurrio un error en lo9gin de github: ' + error)
        }
    }));

    //Esta extrae y valida el usuario con jwt
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([ extractCookie ]),
        secretOrKey: 'secretForJWT'
    }, (jwt_payload, done) => {
        try {
            //console.log(jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            console.log(error)       
        }
    }))

    //
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        return user;
    })
}

export default initializePassport;