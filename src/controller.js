import Adaptor from './models/Adaptor'
import Dewar from './models/Dewar'
import Puck from './models/Puck'
import Port from './models/Port'

export function handleAction(action) {
  switch (action.type) {
    case 'ADD_DEWAR': {
      return Dewar.create(action.dewar)
    }
    case 'DELETE_DEWAR': {
      return Dewar.remove({name: action.dewar})
    }
    case 'UPDATE_DEWAR': {
      return Dewar.findOneAndUpdate(
        {name: action.dewar},
        action.update
      )
    }
    case 'SET_DEWAR_OFFSITE': {
      return Dewar.findOneAndUpdate(
        {name: action.dewar},
        {onsite: false}
      ).then(() => {
        return Puck.update(
          {receptacle: action.dewar, receptacleType: 'dewar'},
          {receptacle: null, receptacleType: null, slot: null},
          {multi: true }
        )
      })
    }
    case 'SET_ADAPTOR_PLACE': {
      return Adaptor.findOneAndUpdate(
        {name: action.adaptor},
        {location: action.location, position: action.position}
      )
    }
    case 'SET_PORT_STATE': {
      return Port.findOneAndUpdate(
        {container: action.container, number: action.number},
        {state: action.state}
      )
    }
    case 'SET_MULTIPLE_PORT_STATES': {
      return Port.update(
        {container: action.container, number: {$in: action.numbers}},
        {state: action.state},
        {multi: true }
      )
    }
    case 'SET_PUCK_RECEPTACLE': {
      var update = {
        receptacle: action.receptacle,
        receptacleType: action.receptacleType,
        slot: action.slot,
      }
      if (action.receptacleType === 'dewar') {
        update['lastDewar'] = action.receptacle
      }
      return Puck.findOneAndUpdate({name: action.puck}, update)
    }
    case 'ADD_PUCK': {
      return Puck.create(action.puck).then(() => {
        let ports = []
        for (let number = 1; number <= 16; number += 1) {
          ports.push({
            containerType: 'puck',
            container: action.puck.name,
            number,
          })
        }
        return Port.create(ports)
      })
    }
    case 'DELETE_PUCK': {
      return Puck.remove({name: action.puck})
    }
    case 'UPDATE_PUCK': {
      return Puck.findOneAndUpdate(
        {name: action.puck},
        action.update
      )
    }
    case 'CLEAR_PUCKS_FOR_RECEPTACLE': {
      return Puck.update(
        {receptacle: action.receptacle, receptacleType: action.receptacleType},
        {receptacle: null, receptacleType: null, slot: null},
        {multi: true }
      )
    }
  }
}
