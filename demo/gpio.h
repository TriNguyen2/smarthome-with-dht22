#ifndef _APPGPIO_H_
#define _APPGPIO_H_
#include <ArduinoJson.h>
#include <Arduino.h>
class AppGPIO {
public:
	AppGPIO(){};
	String set(JsonArray& gpioArr);
	String get(JsonArray& gpioArr);
};
#endif