

#include "gpio.h"

String AppGPIO::get(JsonArray& gpioArr)
{
	String resp = "[";
	for (JsonArray::iterator item = gpioArr.begin(); item != gpioArr.end(); ++item) {
		if(resp != "[")
			resp += ",";

		String io = (*item)["io"].asString();
		String val = String(digitalRead(io.toInt()));
		
		resp += "{\"io\":" + io + ",\"val\":" + val + "}"; 
		
	}
	resp += "]";
	return resp;
}

String AppGPIO::set(JsonArray& gpioArr)
{
	String resp = "[";
	for (JsonArray::iterator item = gpioArr.begin(); item != gpioArr.end(); ++item) {
		if(resp != "[")
			resp += ",";

		String io = (*item)["io"].asString();
		String val = (*item)["val"].asString();
		if(io != "" && val != "") {
			digitalWrite(io.toInt(), val.toInt());
		}
		
		resp += "{\"io\":" + io + ",\"val\":" + val + "}"; 
		
	}
	resp += "]";
	return resp;
}