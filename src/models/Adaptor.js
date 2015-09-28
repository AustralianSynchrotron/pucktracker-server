import mongoose, {Schema} from 'mongoose'

const schema = new Schema({
  name: String,
  location: String,
  position: String,
})

export default mongoose.model('Adaptor', schema)
