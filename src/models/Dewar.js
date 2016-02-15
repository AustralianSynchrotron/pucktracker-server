import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  epn: String,
  owner: String,
  institute: String,
  note: String,
  containerType: String,
  expectedContainers: String,
  onsite: Boolean,
  department: String,
  streetAddress: String,
  city: String,
  state: String,
  postcode: String,
  country: String,
  phone: String,
  email: String,
  returnDewar: Boolean,
  courier: String,
  courierAccount: String,
  addedTime: Date,
  arrivedTime: Date,
  departedTime: Date,
  experimentStartTime: Date,
  experimentEndTime: Date,
  filledTime: Date,
  missing: Boolean,
})

const Dewar = mongoose.model('Dewar', schema)

export default Dewar

export function nextNameForEpn (epn, callback) {
  const regex = new RegExp(`d-${epn}-([0-9]+)`)
  Dewar.find({name: regex}, (err, dewars) => {
    let nextNumber
    if (dewars.length) {
      const usedNumbers = dewars.map(dewar => parseInt(dewar.name.match(regex)[1]))
      nextNumber = Math.max(...usedNumbers) + 1
    } else {
      nextNumber = 1
    }
    callback(`d-${epn}-${nextNumber}`)
  })
}
