//
//  richMotionSensor.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 23/11/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')


const RichMotionSensor = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.configureMqtt()
  }

  getAccessoryServices() {
    const motionSensor = new this.homebridge.Service.MotionSensor(this.config.name)
    this.threshold = this.config.threshold || 0
    if (this.threshold === 0) {
      this.threshold = null
    }
    this.isOn = false
    motionSensor
      .getCharacteristic(this.homebridge.Characteristic.MotionDetected)
      .on('get', this.getState.bind(this))
    return [motionSensor]
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
      this.log('Setting Rich Motion Sensor Value to ' + newValue)
    }
    this.isOn = newValue
    const res = this.isOn
    this.services[0]
      .getCharacteristic(this.homebridge.Characteristic.MotionDetected)
      .updateValue(res)
  }

  getState(callback) {
    callback(null, this.getStateFromCache())
  }

  getStateFromCache() {
    return this.isOn
  }

  getModelName() {
    return 'Rich Motion Sensor'
  }

  getSerialNumber() {
    return '00-001-RichMotionSensor'
  }
}

module.exports = RichMotionSensor
