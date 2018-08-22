//
//  broker.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//
const mosca = require('mosca')

const MQTTBroker = class {
  constructor(log, config = {}, callback) {
    this.log = log
    this.config = config
    this.callback = callback
  }

  start(callback) {
    const mongoHost = this.config.mongoUrl || 'mongodb://localhost:27017/mqtt'
    const port = this.config.port || 1883
    const ascoltatore = {
      type: 'mongo',
      url: mongoHost,
      pubsubCollection: 'ascoltatori',
      mongo: {},
    }
    const moscaSettings = {
      port: port,
      backend: ascoltatore,
      persistence: {
        factory: mosca.persistence.Mongo,
        url: mongoHost,
      },
    }
    this.server = new mosca.Server(moscaSettings)
    this.log('MQTT Server starting at port : ' + port + ' with mongoUrl : ' + mongoHost)
    this.server.on('ready', () => {
      this.log('MQTT Broker/Server running at port ' + port)
      callback()
    })

    this.server.on('published', (packet) => {
      if (this.config.debug) {
        this.log('MQTT Server Publish : ' + packet.topic + ' : ' + packet.payload.toString())
      }
      this.callback({ topic: packet.topic, payload: packet.payload.toString() })
    })
  }

  subscribe() {
    // No need to subcribe in broker
  }

  publish(topic, data) {
    this.server.publish({
      topic: topic,
      retain: false,
      qos: 0,
      payload: data,
    })
  }
}

module.exports = MQTTBroker
