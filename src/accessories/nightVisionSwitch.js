//
//  nightVisionSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')

const NightVisionSwitch = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.isOn = false
    this.configureMqtt()
  }

  getAccessoryServices() {
    const nightVisionSwitch = new this.homebridge.Service.Switch(this.config.name)
    nightVisionSwitch
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.switchStateChanged.bind(this))
    return [nightVisionSwitch]
  }

  configureMqtt() {
    this.subscribeToMQTT('/night_mode')
  }

  mqttRecieved(res) {
    if (res.payload === 'ON') {
      this.updateState(true)
    } else if (res.payload === 'OFF') {
      this.updateState(false)
    }
  }

  switchStateChanged(newState, callback) {
    const newValue = !this.isOn
    this.updateState(newValue)
    var pubTopic = ''
    if (newValue === true) {
      pubTopic = 'ON'
    } else {
      pubTopic = 'OFF'
    }
    this.publishToMQTT('/night_mode/set', pubTopic)
    callback()
  }

  updateState(isOn) {
    if (isOn !== this.isOn) {
      this.log('Setting Night Vision Switch Value to ' + isOn)
    }
    this.isOn = isOn
    const res = this.isOn
    this.services[0]
      .getCharacteristic(this.homebridge.Characteristic.On)
      .updateValue(this.encodeState(res))
  }

  getState(callback) {
    callback(null, this.encodeState(this.getStateFromCache()))
  }

  encodeState(state) {
    if (state) {
      return true
    }

    return false
  }

  getStateFromCache() {
    return this.isOn
  }

  getModelName() {
    return 'Night Vision Switch'
  }

  getSerialNumber() {
    return '00-001-NightVisionSwitch'
  }
}

module.exports = NightVisionSwitch
