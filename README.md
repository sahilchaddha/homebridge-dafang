# homebridge-dafang

[![NPM](https://nodei.co/npm/homebridge-dafang.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/homebridge-dafang/)

[![npm](https://img.shields.io/npm/dm/homebridge-dafang.svg)](https://www.npmjs.com/package/homebridge-dafang)
[![npm](https://img.shields.io/npm/v/homebridge-dafang.svg)](https://www.npmjs.com/package/homebridge-dafang)
[![GitHub release](https://img.shields.io/github/release/sahilchaddha/homebridge-dafang.svg)](https://github.com/sahilchaddha/homebridge-dafang)


Homebridge Plugin for Xiaomi Dafang Camera

## Installation

1. Install ffmpeg on your device
2. Install the plugin using:

```shell
    $ npm install -g --unsafe-perm homebridge
    $ npm install -g --unsafe-perm homebridge-dafang
```
3. Connect/Run MongoDB to host MQTT locally. Change Config to connect to external MQTT Broker. You can use mlab.com to host a free mongoDB instance.
4. Edit config.json and add your camera.
5. Run Homebridge
6. Add extra camera accessories in Home app. The setup code is the same as in homebridge.You can go into -> `Add New Accessory -> Add Manually -> Add Homebridge Pin -> Select Camera -> Add`


## Prerequisite : 

1. Xiaomi Dafang Camera running CFW (https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/)

MQTT-Control & MQTT-Status must be running with configured host. You can configure MQTT Broker configuration at `/system/sdcard/config/mqtt.conf`.

This library supports hosting MQTT Broker as well as connecting to existing Broker as a Client.

## Lint

```shell
    $ npm run lint
```

## Accessories : 

| Accessory             | Type | Description                                           | Config |
|--------------------|---------|-------------------------------------------------------|----------| ----- |
| Motion Sensor      | `motionSensor` | Alerts if Motion is Detected         | threshold(optional) => In ms.        |
| Night Vision Sensor           | `nightVisionSensor` | Alerts if Night Mode is Detected                          | threshold(optional) => In ms.      |
| Night Vision Switch               | `nightVisionSwitch` | Toggles Night Mode on Camera => IR_LED ON IR_CUT OFF                                 | None       |
| Automatic Night Mode Toggle Switch           | `autoNightVisionSwitch` | Toggles Automatic Night Mode on Camera | None      |
| Automatic Motion Tracking Switch         | `autoMotionTrackingSwitch` | Toggles Automatic Motion Tracking on Dafang                                  | None      |
| Move/Rotate Camera Motor         | `moveCamera` | Moves Dafang Camera Horizontal/Vertical right/left up/down Motor                                  | axis(required) => horizontal/vertical, direction(required) => left/right for horizontal and up/down for vertical      |

Threshold => Lesser Threshold, More Accuracy. Dafang Motion detection is sensitive, and it toggles very quickly, to keep the state of sensor more stable little threshold shoul

## Todo : 

- [X] Motion Sensor
- [X] Night Mode Sensor
- [X] Night Mode Toggle Switch
- [X] Automatic Night Mode Toggle Switch
- [X] Automatic Motion Tracking Toggle Switch
- [X] Camera
- [X] Rotate/Move Camera
- [X] Support for Multiple Cameras (Volunteer Testers Required)
- [ ] Update Documentation + Sample Video
- [ ] Recording Video + Audio on NAS/Rpi
- [ ] Recoring Audio on NAS/Rpi
- [ ] Intercom 2 Way Audio *

 `* => Needs changes on Dafang CFW.`

## Sample Config : 

```json
{
    "platforms": [
        {
            "platform": "Dafang",
            "mqtt": {
                "hostBroker": true, // Hosts MQTT Broker Locally using MongoDB. Set false to connect to external MQTT Broker.
                "port": 1883,
                "host": "localhost",
                "debug": true,
                "mongoUrl": "mongodb://localhost:27017/mqtt"
            },
            "cameras": [{
                "cameraName": "My Dafang",
                "cameraIP": "192.168.1.12",
                "mqttTopic": "home/dafang/#", // Topic Should match Dafang Device Config
                "disableStream": false,
                "accessories": [
                                    {
                                        "name": "Living Room Motion Sensor",
                                        "type": "motionSensor",
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
                                    }
                    ],
                    "videoConfig": {
                        "source": "-rtsp_transport tcp -i rtsp://DAFANG_IP:8554/unicast",
                        "stillImageSource": "-rtsp_transport http -i rtsp://DAFANG_IP:8554/unicast -vframes 1 -r 1",
                        "maxStreams": 5,
                        "maxWidth": 1280,
                        "maxHeight": 720,
                        "maxFPS": 25,
                        "vcodec": "h264",
                        "debug": true
                }
            }]
        }
    ]
}
```