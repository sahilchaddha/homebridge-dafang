//
//  captureImageSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 26/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Recorder = require('node-rtsp-recorder').Recorder
const Accessory = require('./base/base')


const CaptureImageSwitch = class extends Accessory {
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
    this.log('Capturing Image')
    const self = this
    var rec = new Recorder({
      url: this.config.cameraRTSPStreamUrl,
      folder: this.config.folder,
      name: this.config.cameraName,
      type: 'image',
      directoryPathFormat: this.config.recordingDirectoryPathFormat,
      fileNameFormat: this.config.recordingFilenameFormat,
    })

    rec.captureImage(() => {
      self.log('Image Captured')
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
    return 'Capture Image Switch'
  }

  getSerialNumber() {
    return '00-001-CaptureImageSwitch'
  }
}

module.exports = CaptureImageSwitch
