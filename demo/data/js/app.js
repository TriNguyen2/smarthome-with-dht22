
//////////////////////////////////////////////////////////////
//var float_temp =0;
var index = 0;
var data;
var enable;
var anhsang_char1 = [];

var anhsang1 = document.getElementById("lumen1");

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
            console.log(data.anhsang1);
			anhsang1.innerHTML = data.anhsang1;
            if(anhsang_char1.length < 10)
            {
				anhsang_char1.push({x: index, y: data.anhsang1});
                index++ ;
            }
            else
            {
				anhsang_char1.shift();
            }
			
			if(data.anhsang1 < 700 && enable == true)
			{
				WS.request('gpio', 'post', [{
				io: 3,
				val: 1
				}]);
			}
			if(data.anhsang1 >= 700 && enable == true)
			{
				WS.request('gpio', 'post', [{
				io: 3,
				val: 0
				}]);
			}
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
   /* var chart = new CanvasJS.Chart("humid-chart", 
	{
    animationEnabled: true,
    exportEnabled: true,
    title:
	{
        text: ""
    },
    axisY:
	{ 
        title: "Độ ẩm",
        includeZero: false, 
        suffix: "%",
        valueFormatString: "#.0"
    },
    data: 
	[{
        type: "splineArea",
        color: "rgba(54,158,103,.7)",
        markerSize: 5,
        dataPoints: doam_char
    }]
});

    var chart1 = new CanvasJS.Chart("temp-chart", 
	{
    animationEnabled: true,
    exportEnabled: true,
    title:
	{
        text: ""
    },
    axisY:
	{ 
        title: "Nhiệt độ",
        includeZero: false, 
        suffix: "oC",
        valueFormatString: "#.0"
    },
    data: 
	[{
        type: "splineArea",
        color: "rgba(260,50,53,.7)",
        markerSize: 5,
        dataPoints: nhietdo_char
    }]
});*/

 var chart2 = new CanvasJS.Chart("lumen-chart1", 
 {
     animationEnabled: true,
     exportEnabled: true,
     title:
	 {
         text: ""
     },
     axisY:
	 { 
         title: "Cường độ sáng",
         includeZero: false, 
         suffix: "lux",
         valueFormatString: "#.0"
     },
     data: 
	 [{
         type: "spline",
         color: "rgba(60,50,153,.7)",
         markerSize: 5,
         dataPoints: anhsang_char1
     }]
 });
 
//----------------------------------------------------------------------------------------------------------

	chart2.render();
	
    var updateChart = function () 
	{
	chart2.render();   
		
     // update chart after specified time. 
	};
	setInterval(function()
	{
		updateChart()
	}, 1000);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//switch led
function led1() 
{
    if (document.getElementById('led-switch1').checked)
        WS.request('gpio', 'post', [{
            io: 3,
            val: 1
        }]);
    else
        WS.request('gpio', 'post', [{
            io: 3,
            val: 0
        }]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//switch relay
function relay1()
{
	if (document.getElementById('relay-switch1').checked)
        WS.request('gpio', 'post', [{
            io: 12,
            val: 0
        }]);
    else
        WS.request('gpio', 'post', [{
            io: 12,
            val: 1
        }]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// set led on/off with timers
function seton1()	//time on
{
	setTimeout(()=>{WS.request('gpio', 'post', [{
            io: 3,
            val: 1
	}])},5000);
}

function setoff1()	//time off
{
    setTimeout(()=>{WS.request('gpio', 'post', [{
        io: 3,
        val: 0
	}])},5000);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//auto 

function setauto1() 
{
   if (document.getElementById('setauto-switch1').checked)
        enable = true;
    else
        enable = false;
}



























