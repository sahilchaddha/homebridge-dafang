# homebridge-dafang Camera + MQTT Setup

## Installation of Bootloader + CFW on Camera

Refer to [Installation](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/blob/master/hacks/install_cfw.md) to install Bootloader + CFW on your respective camera.

Note : To support Debug Switches like reboot,remount sd card, recalibrate, clone firmware from `https://github.com/sahilchaddha/Xiaomi-Dafang-Hacks/`. Refer to [Installation of new firmware](https://github.com/EliasKotlyar/Xiaomi-Dafang-Hacks/blob/master/hacks/install_cfw.md#installation-of-the-new-firmware)

## MQTT

If everything goes good so far you must be having camera dashboard accessible at `https://CAMERA_IP`.

Default User name : `root`

Default Password : `ismart12`

### Configuring homebridge-dafang

You need a MQTT Broker running in your network to make the plugin interact with camera's interval drivers.

If you dont already have a MQTT Broker in your network, the plugin can host the broker itself. Refer to `Hosting MQTT`

If you already have a running MQTT Broker, plugin can connect to it. Refer to `Connecting to MQTT Broker`

#### Hosting MQTT
Only do this if you dont have a working MQTT Broker in your network.
This should be the case for many people.

1. [Install MongoDB](https://www.google.com/search?q=install+mongodb&rlz=1C5CHFA_enMY772MY772&oq=install+mon&aqs=chrome.0.0j69i60j0l2j69i57j0.2227j0j1&sourceid=chrome&ie=UTF-8) or [Get Free Instance from mlab.com](https://docs.mlab.com/)
2. Plugin Configuration

```json
 "mqtt": {
                "hostBroker": true,
                "debug": true,
                "mongoUrl": "mongodb://localhost:27017/mqtt"
            }
```
Your MQTT broker will run locally at port `1883`
Your MQTT broker should run with your homebridge instance. No need for `Connecting to MQTT Broker`

3. Note your Homebridge running device local IP Address. This IP Address will be your MQTT Broker address. Refer to `ifconfig` to get local ip address.

If you dont plan to run mongoDB instance, you can get a free mongodb instance url from `mlab.com`. Your `mongoUrl` will be something like `mongodb://<dbuser>:<dbpassword>@xxxx.mlab.com:xxxx/mqtt`

Its always better if you have static IP of your homebridge running instance.

### OR 

#### Connecting to MQTT Broker

If you already have a MQTT Broker, you can connect to the broker to exchange messages.
You must be having MQTT Broker address and running port number.

1. Plugin Configuration

```json
 "mqtt": {
                "hostBroker": false,
                "port": 1883,
                "host": "192.168.0.187", // MQTT Broker address
                "debug": true,
            }
```
## Configuring Camera

You can either SSH to your camera or connect camera's SD card to your computer.

Config Location : 

Via SSH : `/system/sdcard/config`
Via SD Card : `config`

1. Rename `config/mqtt.conf.dist` => `config/mqtt.conf`
2. Edit `mqtt.conf`

```sh
############################################################
# edit this file and move it to /system/sdcard/config/mqtt.conf #
############################################################

export LD_LIBRARY_PATH='/thirdlib:/system/lib:/system/sdcard/lib'

# Options for mosquitto_sub & mosquitto_pub
USER=mqtt-user
PASS=mqtt-password
# Your MQTT Broker IP
# Your Homebridge running instance local IP if the plugin is hosting it noted from step 3 of `Hosting MQTT`
HOST=192.168.0.187
PORT=1883

# Define a location
LOCATION="myhome"

# Define device name
DEVICE_NAME="dafang"

TOPIC="$LOCATION/$DEVICE_NAME"
MOSQUITTOOPTS=""
MOSQUITTOPUBOPTS=""
CURLOPTS=""
STATUSINTERVAL=30
```

If the plugin is hosting MQTT Broker then set `USER` to default `mqtt-user` & `PASS` to `mqtt-password`

Each camera must have a unique topic. 
Change `LOCATION` & `DEVICE_NAME` to something unique.
e.g.
```
    LOCATION="myhome"
    DEVICE_NAME="dafang"
```
Your camera topic will be `myhome/dafang/#`.

3. Edit Homebridge config.json to update plugin configuration to point each camera to its unique topic.

```json
{
            "platform": "Dafang",
            "mqtt": {
                ...
            },
            "cameras": [{
                "cameraName": "My Dafang",
                "cameraRTSPStreamUrl": "rtsp://YOUR_DAFANG_IP:8554/unicast",
                "mqttTopic": "myhome/dafang/#",
                ...
```



## Running MQTT Services

Open Your Camera's Dashboard by opening `https://CAMERA_IP`.

Login with username `root` and password `ismart12`

![](https://raw.githubusercontent.com/sahilchaddha/homebridge-dafang/dev/assets/shot-2.png)

Go to Manage -> Services

![](https://raw.githubusercontent.com/sahilchaddha/homebridge-dafang/dev/assets/shot-1.png)

Scroll to `mqtt-control` service.

Start `mqtt-control` and set autorun to on
Start `mqtt-status` and set autorun to on

Contributions always welcome.
If you have any question/advice/suggestion kindly create Github Issue