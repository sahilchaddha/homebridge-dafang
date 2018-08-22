//
//  motionSensor.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')


const MotionSensor = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.configureMqtt()
  }

  getAccessoryServices() {
    const occupancySensor = new this.homebridge.Service.OccupancySensor(this.config.name)
    this.threshold = this.config.threshold || 0
    if (this.threshold === 0) {
      this.threshold = null
    }
    this.isOn = false
    occupancySensor
      .getCharacteristic(this.homebridge.Characteristic.OccupancyDetected)
      .on('get', this.getState.bind(this))
    return [occupancySensor]
  }

  configureMqtt() {
    this.subscribeToMQTT('/motion')
  }

  mqttRecieved(res) {
    if (res.payload === 'ON') {
      if (this.timer != null) {
        clearTimeout(this.timer)
      }
      this.updateState(true)
    } else if (res.payload === 'OFF') {
      if (this.threshold != null) {
        this.timer = setTimeout(() => {
          this.updateState(false)
        }, this.threshold)
      } else {
        this.updateState(false)
      }
    }
  }

  updateState(newValue) {
    if (newValue !== this.isOn) {
      this.log('Setting Motion Sensor Value to ' + newValue)
    }
    this.isOn = newValue
    const res = this.isOn
    this.services[0]
      .getCharacteristic(this.homebridge.Characteristic.OccupancyDetected)
      .updateValue(this.encodeState(res))
  }

  getState(callback) {
    callback(null, this.encodeState(this.getStateFromCache()))
  }

  encodeState(state) {
    if (state) {
      return this.homebridge.Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
    }

    return this.homebridge.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED
  }

  getStateFromCache() {
    return this.isOn
  }

  getModelName() {
    return 'Motion Sensor'
  }

  getSerialNumber() {
    return '00-001-MOTION'
  }
}

module.exports = MotionSensor
