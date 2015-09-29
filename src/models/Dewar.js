import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  epn: String,
})

export default mongoose.model('Dewar', schema)
