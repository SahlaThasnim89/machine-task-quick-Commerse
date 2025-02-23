const mongoose= require('mongoose')
const addressSchema= new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    address:[{
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    }]

})
export default mongoose.models.Address ||mongoose.model('Address',addressSchema)