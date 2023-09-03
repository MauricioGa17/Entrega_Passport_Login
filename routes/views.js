import { Router } from 'express'
import passport from 'passport';
import productsModel from '../models/products.model.js'
import cartModel from '../models/cart.model.js'

const router = Router();

//Auth Login
router.get('/', async(req, res) => {

    //Regresa la Vista de Login
    return res.render('auth/login', {
        layout: false
    });
})

router.get('/register', async(req, res) => {
    res.render('auth/register', {
        layout: false
    });
})

router.get('/profile', passport.authenticate('jwt', { session: false }), async(req, res) => {

    const { user } = req

    res.render('auth/profile', user);
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/fail-github' }), (req, res) => {
    console.log("Callback: " + req.user);
    res.cookie('keyCookieForJWT', req.user.token).redirect('/products   ');
})

router.get('/products', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), async(req, res) => {

    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);
    const query = req.query.query;
    const sort = req.query?.sort || '';

    let filtro = {}

    if(query != null){
        filtro = { $or:[{"category": query}, {"status": query}]}
    }

    //Buscar Class BD
    const products = await productsModel.paginate(filtro , {
        page: page,
        limit: limit,
        lean: true,
        sort: {
            price: sort
        }
    })

    products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : ''     
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : ''

    res.render('products', products)
})

router.get('/product/:idProduct', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), async(req, res) => {

    const { idProduct } = req.params;

    const product = await productsModel.findById(idProduct);
    
    res.render('product', {
        helpers:{
            title() {return product.title},
            description() {return product.description},
            stock() {return product.stock},
            status() {return product.status},
        }
    })
})

router.get('/cart', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), async (req, res) => {

    const cart = await cartModel.findOne()
    res.render('cart', cart)
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default router