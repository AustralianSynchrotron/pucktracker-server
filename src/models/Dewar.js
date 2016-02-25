import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  name: {type: String, index: {unique: true}},
  epn: String,
  beamline: String,
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
  piEmail: String,
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

schema.methods.expectedPucks = function (cb) {
  const expectedPuckNames = parseExpectedContainers(this.expectedContainers)
  return this.model('Puck').find({name: {$in: expectedPuckNames}}, cb)
}

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

export function parseExpectedContainers (expectedContainers) {
  if (!expectedContainers) { return [] }
  const parsed = expectedContainers.split(' | ').map(rawStr => {
    const result = /([0-9]+)\s*$/.exec(rawStr)
    if (!result) { return null }
    const numStr = result[1]
    const paddedNumStr = ('0000' + numStr).substring(numStr.length)
    return `ASP${paddedNumStr}`
  })
  return parsed.filter(c => !!c)
}
