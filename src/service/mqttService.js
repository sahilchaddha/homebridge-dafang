
const MQTTBroker = require('../mqtt/broker')
const MQTTClient = require('../mqtt/client')

const MQTTService = class {
  constructor(log, config = {}) {
    this.callbacks = {}
    this.config = config
    this.log = log
    this.mqtt = null
  }

  initMQTT(callback) {
    if (this.config.mqtt != null) {
      this.mqtt = null
      const serviceCallback = this.mqttRecieved.bind(this)
      if (this.config.mqtt.hostBroker) {
        this.isBroker = true
        this.mqtt = new MQTTBroker(this.log, this.config.mqtt, serviceCallback)
      } else {
        this.isBroker = false
        this.mqtt = new MQTTClient(this.log, this.config.mqtt, serviceCallback)
      }
      this.mqtt.start(() => {
        callback()
      })
    } else {
      this.log('MQTT Disabled.')
      callback()
    }
  }

  subscribe(accTopic, callback) {
    if (this.callbacks[accTopic] == null) {
      this.callbacks[accTopic] = []
    }
    this.callbacks[accTopic].push(callback)
  }

  subscribeToMQTT(topic) {
    if (this.mqtt != null) {
      this.mqtt.subscribe(topic)
    }
  }

  mqttRecieved(response) {
    if (this.callbacks[response.topic] != null) {
      this.log(' ** Sending MQTT event to accessory at ' + response.topic + ' with payload : ' + response.payload)
      this.callbacks[response.topic].forEach((element) => {
        element(response)
      })
    }
  }

  publish(topic, data) {
    if (this.mqtt != null) {
      this.log('***** Publishing To : ' + topic + ' With payload : ' + data)
      this.mqtt.publish(topic, data)
    }
  }
}

module.exports = MQTTService
