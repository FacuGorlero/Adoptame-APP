import mongoose from 'mongoose';

const collection = 'Pets';

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    specie:{
        type:String,
        required:true
    },
    birthDate:Date,
    adopted:{
        type:Boolean,
        default:false
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Relación con el modelo de usuarios
        default: null  // Permite que el campo pueda ser null
      },
    image:String
})

const petModel = mongoose.model(collection,schema);

export default petModel;