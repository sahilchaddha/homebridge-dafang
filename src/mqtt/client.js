//
//  client.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const mqtt = require('mqtt')

const MQTTClient = class {
  constructor(log, config = {}, callback) {
    this.log = log
    this.config = config
    this.callback = callback
  }

  start(callback) {
    const mqttHost = this.config.host || 'localhost'
    const mqttPort = this.config.port || 1883
    this.log('MQTT Client connecting to ' + mqttHost + ' : ' + mqttPort)
    this.client = mqtt.connect('mqtt://' + mqttHost + ':' + mqttPort);
    this.client.on('connect', () => {
      this.log('MQTT Client Connected to ' + mqttHost + ':' + mqttPort)
    })

    this.client.on('offline', () => {
      this.log('MQTT Client Cannot Connect at ' + mqttHost + ':' + mqttPort)
    })

    this.client.on('message', (topic, message) => {
      if (this.config.debug) {
        this.log('MQTT Client Publish : ' + topic + ' : ' + message.toString())
      }
      this.callback({ topic: topic, payload: message.toString() })
    })
    callback()
  }

  subscribe(topic) {
    this.log('Subscribing to Channel ' + topic)
    this.client.subscribe(topic)
  }

  publish(topic, data) {
    this.client.publish(topic, data)
  }
}

module.exports = MQTTClient
