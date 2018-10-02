//
//  dirSpaceSwitch.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 26/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//
const FileHandler = require('node-rtsp-recorder').FileHandler
const Accessory = require('./base/base')

const fh = new FileHandler()

const DirectorySpaceSensor = class extends Accessory {
  constructor(log, config, accessory, homebridge, mqttService) {
    super(log, config, accessory, homebridge, mqttService)
  }

  getAccessoryServices() {
    const occupancySensor = new this.homebridge.Service.OccupancySensor(this.config.name)
    this.isOn = false
    this.maxDirSize = this.config.maxDirSize || 2048
    this.checkRecordingSizeInterval = this.config.checkStorageSizeInterval || 300
    occupancySensor
      .getCharacteristic(this.homebridge.Characteristic.OccupancyDetected)
      .on('get', this.getState.bind(this))
    setInterval(this.checkDiskSpace.bind(this), this.checkRecordingSizeInterval * 1000)
    return [occupancySensor]
  }

  checkDiskSpace() {
    const self = this
    self.log('Checking Recordings Folder Size : ' + this.config.folder)
    if (self.config.folder == null) {
      self.log('Folder Key missing in configuration')
      return
    }
    fh.getDirectorySize(this.config.folder, (err, value) => {
      if (err) {
        self.log('Error Occured')
        self.log(err)
        return true
      }
      const sizeInMB = value / 1024 / 1024
      self.log('Recorded Media Folder Size is ' + sizeInMB + 'MB')
      if (sizeInMB > self.maxDirSize) {
        self.updateState(true)
      } else {
        self.updateState(false)
      }
      return true
    })
  }

  updateState(newValue) {
    if (newValue !== this.isOn) {
      this.log('Setting Directory Space Sensor Value to ' + newValue)
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
    return 'Directory Space Sensor'
  }

  getSerialNumber() {
    return '00-001-DirectorySpaceSensor'
  }
}

module.exports = DirectorySpaceSensor
