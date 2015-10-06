import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  epn: String,
  owner: String,
  note: String,
  onsite: Boolean,
})

export default mongoose.model('Dewar', schema)
