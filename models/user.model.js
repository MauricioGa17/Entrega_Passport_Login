import mongoose from 'mongoose';

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    },
    cart_id:{
        type: Number,
    },
    role:{
        type: String,
        default: 'user'
    }
});

mongoose.set('strictQuery', false);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;