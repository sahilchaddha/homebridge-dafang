//
//  clearDirSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 26/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const FileHandler = require('node-rtsp-recorder').FileHandler
const path = require('path')
const Accessory = require('./base/base')

const fh = new FileHandler()

const ClearDirectorySwitch = class extends Accessory {
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
    this.log('Clearing Directory')
    const self = this
    fh.removeDirectory(path.join(this.config.folder, '*'), () => {
      self.log('Directory Cleaned')
      callback()
      self.updateState()
    })
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
    return 'Remove Directory Switch'
  }

  getSerialNumber() {
    return '00-001-RemoveDirectory'
  }
}

module.exports = ClearDirectorySwitch
