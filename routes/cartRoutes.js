import { Router } from "express";

//Models
import cartModel from '../models/cart.model.js'

const router = Router();

router.get('/:idCart', async (req, res) => {

    const idCart = req.params.idCart

    const cart = await cartModel.findOne({_id: idCart})

    if(!cart._id){
        return res.status(404).json({
            "statusCode": 404,
            "message": "No se encontro el carrito"
        });
    }

    return res.status(200).json({
        "statusCode": 200,
        "cart": cart
    });
})

router.post('/', async (req, res) => {

    const { product } = req.body;


    const cart = await cartModel.findOne();

    if(cart == null){
        const newCart = await cartModel.create({});
        return res.status(200).json({
            "statusCode": 200,
            newCart
        });
    }

    const actualCart = await cartModel.findOne({ _id: cart._id });
    actualCart.products.push({ product: product })
        
    const result = await cartModel.updateOne({ _id: cart._id }, actualCart)
    
    return res.status(200).json({
        "statusCode": 200,
        "message": result
    });
});

/*router.post('/:idCart/product/:idProduct', (req, res) => {

    const { idCart, idProduct } = req.params;
    const { quantity } = req.body;

    if(!quantity){
        return res.status(500).json({
            "statusCode": 500,
            "message" : "La cantidad es obligatoria",
        })
    }
    
    const cart = new CartManager('cart.json');
    const cartAddProduct = cart.cartAddProduct(idCart, idProduct, quantity);

    return res.status(200).json({
        "statusCode": 200,
        "response" : cartAddProduct,
    })

});*/



export default router;