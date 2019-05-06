/**
* @Developed by @ArihantBhugari
*/

const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    phone: {
        country: { type: String, required: false, default: "+91" },
        number: { type: String, required: true, min: 10, max: 13 },
    },
    role: { type: String, required: true, max: 10 },
    password: { type: String, required: true },
    status: { type: String, required: false },
    isAuthy: { type: Boolean, required: true, default: false },
    created: { type: Date, default: Date.now }
});



module.exports = mongoose.model('User', userSchema);