
//////////////////////////////////////////////////////////////
//var float_temp =0;
var index = 0;
var data;

function setMsg(cls, text) {
    sbox = document.getElementById('status_box');
    sbox.className = "siimple-alert  siimple-alert--" + cls;
    sbox.innerHTML = text;
    console.log(text);
}

var WS = {
    ws: undefined,
    connected: false,
    open: function(uri) 
	{
        this.instance = null;
        this.ref = null;
        this.ws = new WebSocket(uri);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = function(evt) 
		{
            setMsg("done", "WebSocket already.");
            WS.connected = true;
        };
        this.ws.onerror = function(evt) 
		{
            setMsg("error", "WebSocket error!");
            this.connected = false;
        };
        this.ws.onmessage = function(evt) 
		{
            data = JSON.parse(evt.data);
        };
    },
    write: function(data) 
	{
        if (this.connected)
            this.ws.send(data);
    },
    request: function(action, method, params, instance, ref) 
	{
        var reqObject = 
		{
            type: 'req',
            method: method,
            action: action,
            param: params
        }
        console.log(reqObject, this);
        this.instance = instance;
        this.ref = ref;
        this.write(JSON.stringify(reqObject));
        console.log(JSON.stringify(reqObject));
    }
}

window.onload = function() 
{
    WS.open('ws://192.168.4.1:81/ws');
    var url = window.location.host;
    console.log(url);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//switch led

function led3() 
{
    if (document.getElementById('led-switch3').checked)
        WS.request('gpio', 'post', [{
            io: 16,
            val: 1
        }]);
    else
        WS.request('gpio', 'post', [{
            io: 16,
            val: 0
        }]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// set led on/off with timers

function seton3()	//time on
{
	setTimeout(()=>{WS.request('gpio', 'post', [{
            io: 16,
            val: 1
	}])},1000);
}

function setoff3()	//time off
{
    setTimeout(()=>{WS.request('gpio', 'post', [{
        io: 16,
        val: 0
	}])},1000);
}



























