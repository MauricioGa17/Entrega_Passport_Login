import mongoose from 'mongoose';

const cartCollection = 'cart';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products" //Referencia al documento (Importante)
                }
            }
        ],
        default: []
    }
});

mongoose.set('strictQuery', false);

//Configuracion de Relaciones
cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;