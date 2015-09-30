import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  receptacleType: String,
  receptacle: String,
  slot: String,
  note: String,
  owner: String,
})

export default mongoose.model('Puck', schema)
