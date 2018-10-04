//
//  brightness.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 04/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')


const BrightnessSensor = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.configureMqtt()
    this.currentValue = 0.0001
  }

  getAccessoryServices() {
    const lightSensor = new this.homebridge.Service.LightSensor(this.config.name, this.config.name)
    lightSensor
      .getCharacteristic(this.homebridge.Characteristic.CurrentAmbientLightLevel)
      .on('get', this.getState.bind(this))
    return [lightSensor]
  }

  configureMqtt() {
    this.subscribeToMQTT('/brightness')
  }

  mqttRecieved(res) {
    this.updateState(res.payload)
  }

  updateState(newValue) {
    this.currentValue = parseFloat(newValue)
    this.services[0]
      .getCharacteristic(this.homebridge.Characteristic.CurrentAmbientLightLevel)
      .updateValue(this.currentValue)
  }

  getState(callback) {
    callback(null, this.getStateFromCache())
  }

  getStateFromCache() {
    return this.currentValue
  }

  getModelName() {
    return 'Brightness Sensor'
  }

  getSerialNumber() {
    return '00-001-BrightnessSensor'
  }
}

module.exports = BrightnessSensor
