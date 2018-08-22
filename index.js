//
//  index.js
//  Sahil Chaddha
//
//  Created by Sahil Chaddha on 13/08/2018.
//  Copyright © 2018 sahilchaddha.com. All rights reserved.
//

// Dafang Platform
const Dafang = require('./src/dafang')

module.exports = (homebridge) => {
  var homebridgeGlobals = {
    Service: homebridge.hap.Service,
    Characteristic: homebridge.hap.Characteristic,
    Accessory: homebridge.platformAccessory,
    UUIDGen: homebridge.hap.uuid,
    Categories: homebridge.hap.Accessory.Categories,
    StreamController: homebridge.hap.StreamController,
  }
  Dafang.globals.setHomebridge(homebridgeGlobals)
  homebridge.registerPlatform(Dafang.pluginName, Dafang.platformName, Dafang.platform, true)
}
