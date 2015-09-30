import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  container: String,
  containerType: String,
  number: Number,
  state: {type: String, default: 'unknown'},
})

export default mongoose.model('Port', schema)
