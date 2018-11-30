//
//  restartSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 02/10/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = require('./base/base')

const RestartSwitch = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
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
    this.log('Restarting Dafang')
    const self = this
    this.publishToMQTT('/reboot/set', 'ON')
    self.updateState()
    callback()
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
    return 'Restart Switch'
  }

  getSerialNumber() {
    return '00-001-RestartSwitch'
  }
}

module.exports = RestartSwitch
