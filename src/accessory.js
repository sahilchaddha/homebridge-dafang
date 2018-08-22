//
//  accessory.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

// Accessories
const CameraAccessory = require('./accessories/camera')
const MotionSensorAccessory = require('./accessories/motionSensor')
const AutoMotionTrackingSwitchAccessory = require('./accessories/autoMotionTrackingSwitch')
const NightVisionSensorAccessory = require('./accessories/nightVisionSensor')
const NightVisionSwitchAccessory = require('./accessories/nightVisionSwitch')
const AutoNightVisionSwitchAccessory = require('./accessories/autoNightVisionSwitch')
const IntercomAccessory = require('./accessories/intercom')
const CameraMotorAccessory = require('./accessories/moveCamera')
const RecordAudioAccessory = require('./accessories/recordAudio')
const RecordVideoAccessory = require('./accessories/recordVideo')

module.exports = {
  MotionSensor: MotionSensorAccessory,
  AutoMotionTrackingSwitch: AutoMotionTrackingSwitchAccessory,
  NightVisionSensor: NightVisionSensorAccessory,
  NightVisionSwitch: NightVisionSwitchAccessory,
  AutoNightVisionSwitch: AutoNightVisionSwitchAccessory,
  Intercom: IntercomAccessory,
  CameraMotor: CameraMotorAccessory,
  RecordAudio: RecordAudioAccessory,
  RecordVideo: RecordVideoAccessory,
  Camera: CameraAccessory,
}
