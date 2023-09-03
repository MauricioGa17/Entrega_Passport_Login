import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: Number,
    price: Number,
    status: String,
    stock: Number,
    category: String,
    thumbnail: String,
});

mongoose.set('strictQuery', false);
productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;