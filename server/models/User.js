const { Schema, model, ObjectId } = require('mongoose')


const User = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    files: [{ type: ObjectId, ref: 'File' }], //ref - ссилка на другу сущность
    //roles: [{ type: String, ref: 'Role' }]
})

module.exports = model('User', User)