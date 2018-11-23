# homebridge-dafang

[![NPM](https://nodei.co/npm/homebridge-dafang.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/homebridge-dafang/)

[![npm](https://img.shields.io/npm/dm/homebridge-dafang.svg)](https://www.npmjs.com/package/homebridge-dafang)
[![npm](https://img.shields.io/npm/v/homebridge-dafang.svg)](https://www.npmjs.com/package/homebridge-dafang)
[![CircleCI](https://circleci.com/gh/sahilchaddha/homebridge-dafang.svg?style=svg)](https://circleci.com/gh/sahilchaddha/homebridge-dafang)


Homebridge Plugin for Xiaomi Dafang / Wyze Camera

## Installation

1. Install ffmpeg on your device

```
    $ brew install ffmpeg --with-openh264 --with-fdk-aac
```

2. Install the plugin using:

```shell
    $ npm install -g --unsafe-perm homebridge
    $ npm install -g --unsafe-perm homebridge-dafang
```

3. Install CFW on camera and set up MQTT. Refer to [Setup Readme](https://github.com/sahilchaddha/homebridge-dafang/blob/master/Setup_MQTT.md)
4. Edit config.json and add the plugin. Refer to `config-sample.json` in repository.
5. Run Homebridge
6. Add extra camera accessories in Home app. The setup code is the same as in homebridge.You can go into -> ` + -> Add New Accessory -> Add Manually -> Add Homebridge Pin -> Select Camera -> Add`


Supported Cameras :

Name | Picture
--- | ---
Xiaomi Dafang | ![Dafang](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/dafang.png)
Xiaomi Xiaofang 1S | ![XiaoFang](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/xiaofang.png)
Wyzecam Pan | ![Dafang](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/dafang.png)
Wyzecam V2 | ![XiaoFang](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/xiaofang.png)
Sannce I21AG, MixSight HX-I2110T2, WanScam HW0036, Escam G02, Digoo BB-M2 | ![XiaoFang](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/sannce.jpg)
Any other Device with Ingenic T10/T20 Device | ![T20](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/raw/master/t20.png)

## Todo : 

- [ ] Timelapse Switch
- [ ] Intercom 2 Way Audio **

## Accessories : 

| Accessory                          | Type                | Description                                           | Config |
|------------------------------------|---------------------|-------------------------------------------------------|--------|
| Motion Sensor                      | `motionSensor`      | Alerts if Motion is Detected                          | `threshold(optional) => In ms.`|
| Rich Motion Sensor                      | `richMotionSensor`      | Alerts if Motion is Detected (Rich Notifications)                          | `threshold(optional) => In ms.`|
| Night Vision Sensor                | `nightVisionSensor` | Alerts if Night Mode is Detected                      | `threshold(optional) => In ms.`|
| Night Vision Switch                | `nightVisionSwitch` | Toggles Night Mode on Camera => IR_LED ON IR_CUT OFF  | None   |
| Brightness Lux Sensor                | `brightness` | Brightness Lux Sensor  | None   |
| Automatic Night Mode Toggle Switch | `autoNightVisionSwitch` | Toggles Automatic Night Mode on Camera | None     |
| Automatic Motion Tracking Switch   | `autoMotionTrackingSwitch` | Toggles Automatic Motion Tracking on Dafang    | None  |
| Move/Rotate Camera Motor           | `moveCamera`              | Moves Dafang Camera Horizontal/Vertical right/left up/down Motor| `axis(required) => horizontal/vertical, direction(required) => left/right for horizontal and up/down for vertical`|
| Record Video+Audio           | `recordVideo`              | Records Video + Audio Toggle Switch. Video(mp4) files are saved in local machine running homebridge| None|
| Record Audio Only           | `recordAudio`              | Records Audio Toggle Switch. Audio(aac) files are saved in local machine running homebridge| None|
| Capture Image           | `captureImage`              | Captures Image from Camera and saves to configured folder| None|
| Recorded Media Storage Sensor           | `storageSensor`              | Alerts when recorded media folder storage is full on the system due to recordings. You can set custom disk space in MB in config| None|
| Clear Storage Switch           | `clearStorage`              | Clears All Recordings| None|
| Reset FFMEPG Switch           | `resetFFMPEG`              | Kills all FFMPEG Zombie Scripts. Audio/Video Recordings will restart recording.| None|
| Motion Detection Switch           | `motionDetection`              | Enables/Disable Motion Detection. Turning off this switch will stop sending motion detection alerts.| None|
| RTSP Server Switch           | `rtspSwitch`              | Debug Switch to turn on/off RTSP H264 Stream Server.| None|
| MJPEG Server Switch           | `mjpegSwitch`              | Debug Switch to turn on/off MJPEG Server| None|
| Recalibrate Motor Switch **           | `recalibrateSwitch`              | Debug Switch to Re-Calibrate Camera Motor.| None|
| Restart Camera Switch **           | `restartSwitch`              | Debug Switch to restart Camera.| None|
| Re-Mount SD Card RW Switch **           | `remountSwitch`              | Debug Switch to re mount sd card with RW permission. It prevents SD Card Failures like stuck RTSP Stream.| None|

`** => Reinstall Dafang CFW for system switches with https://github.com/sahilchaddha/Xiaomi-Dafang-Hacks/`

Threshold => Lesser Threshold, More Accuracy. Dafang Motion detection is sensitive, and it toggles very quickly, to keep the state of sensor more stable little threshold will delay frequent alerts

 ## Demo :

 Sorry for crappy quality. Tested on Rpi + Slow Network

### Advanced Demo : 

 ![Advanced Demo](https://raw.githubusercontent.com/sahilchaddha/homebridge-dafang/master/demo-advanced.gif)

### Simple Demo : 

 ![Simple Demo](https://raw.githubusercontent.com/sahilchaddha/homebridge-dafang/master/demo-simple.gif)

### Rich Notifications : 

![Notifications Demo](https://raw.githubusercontent.com/sahilchaddha/homebridge-dafang/master/demo-rich-not.gif)

## Plugin Config : 

| Config                          | Type                | Description                                           | Config |
|------------------------------------|---------------------|-------------------------------------------------------|--------|
| mqtt.hostBroker                      | bool      | Set true to host MQTT Locally, set false to connect to external MQTT Broker.                          | Required|
| cameras                      | Array (Object)      | Can add Multiple Cameras                          | Required|


## Camera Config : 

| Config                          | Type                | Description                                           | Config |
|------------------------------------|---------------------|-------------------------------------------------------|--------|
| cameraRTSPStreamUrl                      | string      | RTSP Stream Url e.g. `rtsp://192.168.1.2:8554/unicast`                          | Required|
| disableStream                | bool | Set true to stream camera, set false to disable camera view                      | Optional|
| mqttTopic                | string | Each Dafang Device must have a unique topic. Topic should match for each corresponding camera accessory                      | Required|
| folder                | string | Absolute path of directory where recordings/images will be saved                      | Required|
| segmentLength                | number | Length of each video file. (in seconds). Each recording will be saved in segmented videos. Default : 60 (1 minute)                      | Optional|
| maxDirSize                | number | Max Size of folder (in mb) where recordings will be saved. Default : 2048 (2GB)                      | Optional|
| checkStorageSizeInterval                | number | Time in seconds to re check recording folder size for `storageSensor`. Default : 300 (5 min)                      | Optional|

```json
{
    "platforms": [
        {
            "platform": "Dafang",
            "mqtt": {
                "hostBroker": true,
                "port": 1883,
                "host": "localhost",
                "debug": true,
                "mongoUrl": "mongodb://localhost:27017/mqtt"
            },
            "cameras": [{
                "cameraName": "My Dafang",
                "cameraRTSPStreamUrl": "rtsp://192.168.1.12:8554/unicast",
                "mqttTopic": "myhome/dafang/#",
                "folder": "/Users/sahilchaddha/Sahil/Recordings/",
                "accessories": [
                                    {
                                        "name": "Living Room Motion Sensor",
                                        "type": "richMotionSensor",
                                        "threshold": 300000
                                    },
                                    {
                                        "name": "Living Room Auto Motion Tracking Switch",
                                        "type": "autoMotionTrackingSwitch"
                                    },
                                    {
                                        "name": "Living Room Night Vision Sensor",
                                        "type": "nightVisionSensor",
                                        "threshold": 0
                                    },
                                    {
                                        "name": "Living Room Night Vision Switch",
                                        "type": "nightVisionSwitch"
                                    },
                                    {
                                        "name": "Living Room Auto Night Vision Switch",
                                        "type": "autoNightVisionSwitch"
                                    },
                                    {
                                        "name": "Horizontal Left",
                                        "type": "moveCamera",
                                        "axis": "horizontal",
                                        "direction": "left"
                                    },
                                    {
                                        "name": "Horizontal Right",
                                        "type": "moveCamera",
                                        "axis": "horizontal",
                                        "direction": "right"
                                    },
                                    {
                                        "name": "Vertical Up",
                                        "type": "moveCamera",
                                        "axis": "vertical",
                                        "direction": "up"
                                    },
                                    {
                                        "name": "Vertical Down",
                                        "type": "moveCamera",
                                        "axis": "vertical",
                                        "direction": "down"
                                    },
                                    {
                                        "name": "Record Video",
                                        "type": "recordVideo"
                                    },
                                    {
                                        "name": "Record Audio",
                                        "type": "recordAudio"
                                    },
                                    {
                                        "name": "Capture Image",
                                        "type": "captureImage"
                                    },
                                    {
                                        "name": "RPi Storage Sensor",
                                        "type": "storageSensor"
                                    },
                                    {
                                        "name": "Clear Storage Switch",
                                        "type": "clearStorage"
                                    },
                                    {
                                        "name": "Reset Streaming",
                                        "type": "resetFFMPEG"
                                    },
                                    {
                                        "name": "Camera Brightness",
                                        "type": "brightness"
                                    }
                    ]
            }]
        }
    ]
}
```

## Lint

```shell
    $ npm run lint
```

## Need Help ?

Get Slack Invite => `https://slackin-znyruquwmv.now.sh/`

Slack Channel => `https://homebridgeteam.slack.com/messages/homebridge-dafang`

Slack User => `@sahilchaddha`

### Author

Sahil Chaddha

mail@sahilchaddha.com