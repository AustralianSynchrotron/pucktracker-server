import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  container: String,
  containerType: String,
  number: Number,
  state: String,
})

export default mongoose.model('Port', schema)
