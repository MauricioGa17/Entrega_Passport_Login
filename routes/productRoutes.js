import { Router, response } from "express";
//Models
import productsModel from '../models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {

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

    products.prevLink = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}` : ''     
    products.nextLink = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}` : ''

    return res.status(200).json({
        "status": "success",
        "products": products
    });
});

router.post('/', async (req, res) => {

    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(500).json({
            "statusCode": 500,
            "message": 'Todos los campos son obligatorios',
        });
    }

    //Guardar Class BD
    await productsModel.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    })
    
    const products = await productsModel.find();
    
    return res.status(200).json({
        "statusCode": 200,
        "message": 'Nuevo Producto agregado',
        "products": products
    });
});

router.get('/:idProduct', async (req, res) => {

    const { idProduct } = req.params;

    try {
        const product = await productsModel.findById(idProduct);

        return res.status(200).json({
            "statusCode": 200,
            "product": product
        });
    } catch (error) {
        return res.status(404).json({
            "statusCode": 404,
            "message": "Producto no encontrado"
        });
    }
});

router.put('/:idProduct', async (req, res) => {

    const { idProduct } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(500).json({
            "statusCode": 500,
            "message": 'Todos los campos son obligatorios',
        });
    }

    //ACtualizar Registro
    await productsModel.updateOne({_id:idProduct}, {
        "title": title,
        "description": description,
        "code": code,
        "price": price,
        "status": status,
        "stock": stock,
        "category": category,
        "thumbnails": thumbnails
    });

    return res.status(200).json({
        "statusCode": 200,
        "message": "Registro actualizado"
    })
});

router.delete('/:idProduct', async (req, res) => {

    const { idProduct } = req.params;

    if(idProduct == null){
        return res.status(404).json({
            "statusCode": 404,
            "message": 'Producto no encontrado para eliminar',
        });
    }

    //Guardar Class BD
    await productsModel.deleteOne({ _id: idProduct });

    return res.status(200).json({
        "statusCode": 200,
        "message" :  "Producto eliminado" 
    });
});


export default router;