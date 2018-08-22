//
//  base.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const Accessory = class {
  constructor(log, config, accessory, homebridge, mqttService) {
    log('Configuring Dafang Accessory : ' + this.getModelName())
    this.homebridge = homebridge
    this.log = log
    this.config = config
    this.accessory = accessory
    this.mqttService = mqttService
    this.name = config.name
    if (this.config.mqttTopic != null) {
      this.topic = this.config.mqttTopic.slice(0, this.config.mqttTopic.length - 2)
    }
    this.services = this.getAccessoryServices()
    this.services.push(this.getInformationService())
  }

  getInformationService() {
    var informationService = new this.homebridge.Service.AccessoryInformation()
    informationService
      .setCharacteristic(this.homebridge.Characteristic.Manufacturer, 'Dafang')
      .setCharacteristic(this.homebridge.Characteristic.Model, this.getModelName())
      .setCharacteristic(this.homebridge.Characteristic.SerialNumber, this.getSerialNumber())
    return informationService
  }

  getAccessoryServices() {
    throw new Error('The getSystemServices method must be overridden.')
  }

  getModelName() {
    throw new Error('The getModelName method must be overridden.')
  }

  getSerialNumber() {
    throw new Error('The getSerialNumber method must be overridden.')
  }

  getServices() {
    return this.services
  }

  subscribeToMQTT(extTopic) {
    if (this.topic != null) {
      this.mqttService.subscribe(this.topic + extTopic, this.mqttRecieved.bind(this))
    }
  }

  mqttRecieved() {
    throw new Error('The mqttRecieved method must be overridden.')
  }

  publishToMQTT(extTopic, data) {
    if (this.topic != null) {
      this.mqttService.publish(this.topic + extTopic, data)
    }
  }
}

module.exports = Accessory
