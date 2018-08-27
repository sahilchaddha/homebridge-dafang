//
//  recordVideo.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Recorder = require('node-rtsp-recorder').Recorder
const Accessory = require('./base/base')

const RecordVideoSwitch = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
    this.isOn = false
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
    const newValue = !this.isOn

    if (newValue) {
      this.rec = null
      this.rec = new Recorder({
        url: this.config.cameraRTSPStreamUrl,
        folder: this.config.folder,
        name: this.config.cameraName,
        timeLimit: this.config.segmentLength,
      })
      // Starts Recording
      this.rec.startRecording()
    } else if (this.rec != null) {
      this.rec.stopRecording()
      this.rec = null
    }

    setTimeout(() => {
      callback()
      this.updateState(newValue)
    }, 5000)
  }

  updateState(isOn) {
    if (isOn !== this.isOn) {
      this.log('Setting Record Video Value to ' + isOn)
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
    return 'Record Video Switch'
  }

  getSerialNumber() {
    return '00-001-RecordVideoSwitch'
  }
}

module.exports = RecordVideoSwitch
