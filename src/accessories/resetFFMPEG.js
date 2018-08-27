//
//  resetFFMPEG.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 26/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const cp = require('child_process')
const Accessory = require('./base/base')

const ResetFFMPEGSwitch = class extends Accessory {
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
    this.log('Killing all FFMPEG Processes')
    const self = this
    var killCommand = cp.spawn('pkill', ['ffmpeg'], { detached: false, stdio: 'ignore' })
    killCommand.on('close', () => {
      self.log('Killed FFMPEG Processes')
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
    return 'Reset FFMPEG Switch'
  }

  getSerialNumber() {
    return '00-001-ResetFFMPEGSwitch'
  }
}

module.exports = ResetFFMPEGSwitch
