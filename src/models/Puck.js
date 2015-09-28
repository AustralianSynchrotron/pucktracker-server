import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
  name: String,
  receptacleType: String,
  receptacle: String,
  slot: String
})

export default mongoose.model('Puck', schema)
