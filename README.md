# homebridge-mqtt-statelessswitch

A stateless programable switch is button that resets after pressing (think push button).
HomeKit treats this accessory type like a sensor with three values; single press, double press and a long hold.
Through HomeKit triggers you can link up anything from a single light switching on upon a single press, to a
whole scene of actions such as dimming lights, turning down the thermostat and locking doors with a long press.

A great example of this type of accessory in the wild is the Logitech Pop smart button: http://www.logitech.com/en-gb/product/pop-smart-button

## Installation
`sudo npm install -g homebridge-mqtt-statelessswitch`


## Sample HomeBridge Configuration
```
{
  "bridge": {
    "name": "HomeBridge",
    "username": "CC:33:3B:D3:CE:32",
    "port": 51826,
    "pin": "321-45-123"
  },

  "description": "",

  "accessories": [
    {
      "accessory": "mqtt-statelessswitch",
      "name": "Living Room Switch",
      "url": "mqtt://localhost",
      "topic": "home/livingroom/statelessswitch",
      "username": "username",
      "password": "password"
    }
  ],

  "platforms": []
}
```

## MQTT Client
This plugin is expecting to receive a JSON message with an `eventValue` attribute.
The value of this attribute must be 0, 1 or 2; mapping to "Single Press", "Double Press" and "Long Press". E.g.
```
{
  "eventValue": 0
}
```

This works great with the [esp8266-mqtt-statelessbutton](https://github.com/jdrucey/esp8266-mqtt-statelessbutton) project to wirelessly send push button events from a simple esp8266 device to the MQTT broker (easily set up on a Raspberry Pi along with [HomeBridge](https://github.com/nfarina/homebridge)).