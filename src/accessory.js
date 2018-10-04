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
const DirectorySpaceSensorAccessory = require('./accessories/dirSpaceSensor')
const ClearDirectorySwitchAccessory = require('./accessories/clearDirSwitch')
const CaptureImageSwitchAccessory = require('./accessories/captureImageSwitch')
const ResetFFMPEGSwitchAccessory = require('./accessories/resetFFMPEG')
const MotionDetectionSwitchAccessory = require('./accessories/motionDetectionSwitch')
const RTSPSwitchAccessory = require('./accessories/rtspSwitch')
const MJPEGSwitchAccessory = require('./accessories/mjpegSwitch')
const BrightnessAccessory = require('./accessories/brightness')

// Debug Accessories

const RecalibrateSwitchAccessory = require('./accessories/recalibrateSwitch')
const RestartSwitchAccessory = require('./accessories/restartSwitch')
const RemountSwitchAccessory = require('./accessories/remountSwitch')

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
  StorageSensor: DirectorySpaceSensorAccessory,
  ClearStorage: ClearDirectorySwitchAccessory,
  CaptureImage: CaptureImageSwitchAccessory,
  ResetFFMPEG: ResetFFMPEGSwitchAccessory,
  MotionDetection: MotionDetectionSwitchAccessory,
  RTSPSwitch: RTSPSwitchAccessory,
  MJPEGSwitch: MJPEGSwitchAccessory,
  RecalibrateSwitch: RecalibrateSwitchAccessory,
  RestartSwitch: RestartSwitchAccessory,
  RemountSwitch: RemountSwitchAccessory,
  BrightnessSensor: BrightnessAccessory,
}
