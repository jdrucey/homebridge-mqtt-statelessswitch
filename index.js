var Service, Characteristic;
var mqtt = require('mqtt');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-mqtt-statelessswitch", "mqtt-statelessswitch", StatelessProgrammableSwitchAccessory);
}

function StatelessProgrammableSwitchAccessory(log, config) {

	this.log = log;

	this.name = config["name"];
	this.url = config['url'];
	this.topic = config['topic'];
	this.sn = config['sn'] || 'Unknown';

	this.client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

	this.options = {
		keepalive: 10,
		clientId: this.client_Id,
		protocolId: 'MQTT',
		protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		username: config["username"],
		password: config["password"],
		rejectUnauthorized: false
	};

	this.service = new Service.StatelessProgrammableSwitch();
	this.client  = mqtt.connect(this.url, this.options);

	var self = this;

	this.client.subscribe(this.topic);
 
	this.client.on('message', function (topic, message) {
		data = JSON.parse(message);
		if (data === null) return null;
		self.value = parseInt(data.eventValue);
		self.service.getCharacteristic(Characteristic.ProgrammableSwitchEvent).setValue(self.value);
	});

}

StatelessProgrammableSwitchAccessory.prototype.getServices = function() {

	var informationService = new Service.AccessoryInformation();

	informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, "jdrucey")
		.setCharacteristic(Characteristic.Model, "Stateless Switch")
		.setCharacteristic(Characteristic.SerialNumber, this.sn);

	return [informationService, this.service];
}

