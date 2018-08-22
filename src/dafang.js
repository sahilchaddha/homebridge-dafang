//
//  dafang.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

const DafangAccessory = require('./accessory')
const MQQTService = require('./service/mqttService')

const pluginName = 'homebridge-dafang'
const platformName = 'Dafang'

// Available Accessories
const classTypes = {
  camera: DafangAccessory.Camera,
  motionSensor: DafangAccessory.MotionSensor,
  autoMotionTrackingSwitch: DafangAccessory.AutoMotionTrackingSwitch,
  nightVisionSensor: DafangAccessory.NightVisionSensor,
  nightVisionSwitch: DafangAccessory.NightVisionSwitch,
  autoNightVisionSwitch: DafangAccessory.AutoNightVisionSwitch,
  intercom: DafangAccessory.Intercom,
  moveCamera: DafangAccessory.CameraMotor,
  recordAudio: DafangAccessory.RecordAudio,
  recordVideo: DafangAccessory.RecordVideo,
}

var homebridge

function CameraAccesories(log, config, service) {
  this.log = log
  this.config = config
  this.dafangAccessories = []
  this.mqttService = service
}

// Platform
CameraAccesories.prototype = {
  accessories: function () {
    if (this.config.accessories == null || this.config.accessories.length === 0) {
      this.log('No Accessories Configured. Please edit your homebridge config.json')
    }

    for (var i in this.config.accessories) {
      var accessoryConfig = this.config.accessories[i]
      if (this.config.mqttTopic != null) {
        accessoryConfig.mqttTopic = this.config.mqttTopic
      }
      if (accessoryConfig.type == null) {
        throw new Error('Each accessory must be configured with a "type". e.g. "switch"')
      }

      if (classTypes[accessoryConfig.type] == null) {
        throw new Error(`homebridge-dafang doesn't support accessories of type "${accessoryConfig.type}".`)
      }

      var uuid = homebridge.UUIDGen.generate(accessoryConfig.name)
      var newAccessory = new homebridge.Accessory(accessoryConfig.name, uuid)
      var homeKitAccessory = new classTypes[accessoryConfig.type](this.log, accessoryConfig, newAccessory, homebridge, this.mqttService)
      this.dafangAccessories.push(homeKitAccessory)
    }
    return Promise.resolve(this.dafangAccessories)
  },
}

function Dafang(log, config = {}, api) {
  this.log = log
  this.config = config
  this.dafangCameras = []
  if (api) {
    this.api = api
    this.api.on('didFinishLaunching', this.didFinishLaunching.bind(this))
  }
}

Dafang.prototype = {
  accessories: function (callback) {
    var dafangPromises = []
    if (this.config.cameras != null && this.config.cameras.length > 0) {
      // Init MQTT Service
      this.mqttService = new MQQTService(this.log, this.config)
      this.mqttService.initMQTT(() => {
        this.log('MQTT Service Initialised')
        this.config.cameras.forEach((cameraConfig) => {
          const newCamera = new CameraAccesories(this.log, cameraConfig, this.mqttService)
          if (cameraConfig.mqttTopic != null) {
            this.mqttService.subscribeToMQTT(cameraConfig.mqttTopic)
          }
          this.dafangCameras.push(newCamera)
          dafangPromises.push(newCamera.accessories())
        })
        Promise.all(dafangPromises)
          .then((newAcc) => {
            var allAccesories = []
            newAcc.forEach((element) => {
              element.forEach((acc) => {
                allAccesories.push(acc)
              })
            })
            callback(allAccesories)
          })
      })
    } else {
      throw new Error('Configuration Not Found. No Cameras Found')
    }
  },
  didFinishLaunching: function () {
    if (this.config != null && this.config.cameras != null) {
      // Add Camera Accessory
      const self = this
      var cameraStreams = []
      self.config.cameras.forEach((cameraConfig) => {
        if (!cameraConfig.disableStream) {
          var uuid = homebridge.UUIDGen.generate(cameraConfig.cameraName)
          var cameraAccessory = new homebridge.Accessory(cameraConfig.cameraName, uuid, homebridge.Categories.CAMERA)
          var newCameraConfig = cameraConfig
          newCameraConfig.name = cameraConfig.cameraName
          const cameraIP = cameraConfig.cameraIP
          if (newCameraConfig.videoConfig == null) {
            newCameraConfig.videoConfig = {}
            newCameraConfig.videoConfig.source = '-rtsp_transport tcp -i rtsp://' + cameraIP + '/unicast'
            newCameraConfig.videoConfig.stillImageSource = '-rtsp_transport http -i rtsp://' + cameraIP + '/unicast -vframes 1 -r 1'
            newCameraConfig.videoConfig.maxStreams = 2
            newCameraConfig.videoConfig.maxWidth = 1280
            newCameraConfig.videoConfig.maxHeight = 720
            newCameraConfig.videoConfig.maxFPS = 30
          }
          var cameraSource = new classTypes.camera(homebridge, newCameraConfig, self.log, 'ffmpeg')
          cameraAccessory.configureCameraSource(cameraSource)
          cameraStreams.push(cameraAccessory)
        }
      })

      self.api.publishCameraAccessories(platformName, cameraStreams)
    }
  },
}

function DafangGlobals() {

}

DafangGlobals.setHomebridge = (homebridgeRef) => {
  homebridge = homebridgeRef
}

module.exports = {
  platform: Dafang,
  globals: DafangGlobals,
  pluginName: pluginName,
  platformName: platformName,
}
