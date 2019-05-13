//
//  moveCamera.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')

const MoveCameraSwitch = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.axis = config.axis || 'horizontal'
    this.direction = config.direction || 'left'
  }

  getAccessoryServices() {
    const switchService = new this.homebridge.Service.Switch(this.config.name)
    switchService
      .getCharacteristic(this.homebridge.Characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.switchStateChanged.bind(this))
    return [switchService]
  }

  switchStateChanged(newState, callback) {
    this.log('Moving Camera Motor')
    this.publishToMQTT('/motors/' + this.axis + '/set', this.direction)
    callback()
    this.updateState()
  }

  updateState() {
    setTimeout(() => {
      this.services[0]
        .getCharacteristic(this.homebridge.Characteristic.On)
        .updateValue(false)
    }, 1000)
  }

  getState(callback) {
    callback(null, false)
  }

  getModelName() {
    return 'Move Camera Switch'
  }

  getSerialNumber() {
    return '00-001-MoveCameraSwitch'
  }
}

module.exports = MoveCameraSwitch
