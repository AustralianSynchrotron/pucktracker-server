import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  location: String,
  position: String,
})

export default mongoose.model('Adaptor', schema)
