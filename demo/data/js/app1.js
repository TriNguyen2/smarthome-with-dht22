
//////////////////////////////////////////////////////////////
//var float_temp =0;
var index = 0;
var data;
var enable1;
var enable2;

var nhietdo_char = [];
var doam_char = [];
var anhsang_char2 = [];

var nhietdo = document.getElementById("temp");
var doam = document.getElementById("humid");
var anhsang2 = document.getElementById("lumen2");

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
            console.log(data.nhietdo);
			console.log(data.anhsang2);
            nhietdo.innerHTML = data.nhietdo;
            doam.innerHTML = data.doam;
			anhsang2.innerHTML = data.anhsang2;
            if(nhietdo_char.length < 10)
            {
                nhietdo_char.push({x: index , y: data.nhietdo});
                doam_char.push({x: index, y: data.doam});
				anhsang_char2.push({x: index, y: data.anhsang2});
                index++ ;
            }
            else
            {
                nhietdo_char.shift();
                doam_char.shift();
				anhsang_char2.shift();
            }
			
			if(data.nhietdo >= 26 && enable2 == true)
			{
				WS.request('gpio', 'post', [{
				io: 13,
				val: 1
				}]);
			}
			
			if(data.nhietdo < 26 && enable2 == true)
			{
				WS.request('gpio', 'post', [{
				io: 13,
				val: 0
				}]);
			}
			
			if(data.anhsang2 >= 700 && enable1 == true)
			{
				WS.request('gpio', 'post', [{
				io: 1,
				val: 0
				}]);
			}
			
			if(data.anhsang2 < 700 && enable1 == true)
			{
				WS.request('gpio', 'post', [{
				io: 1,
				val: 1
				}]);
			}
			
        };
    },
    write: function(data) //"\{"Enable":true}\" 
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
    var chart = new CanvasJS.Chart("humid-chart", 
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
});

 /*var chart2 = new CanvasJS.Chart("lumen-chart1", 
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
         type: "splineArea",
         color: "rgba(60,50,153,.7)",
         markerSize: 5,
         dataPoints: anhsang_char1
     }]
 });*/
 
 var chart3 = new CanvasJS.Chart("lumen-chart2", 
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
         //valueFormatString: "#.0"
     },
     data: 
	 [{
         type: "spline",
         color: "rgba(60,50,153,.7)",
         markerSize: 5,
         dataPoints: anhsang_char2
     }]
 });
 
//----------------------------------------------------------------------------------------------------------

    chart.render();
    chart1.render();
	chart3.render();
    var updateChart = function () 
	{
    chart.render();
    chart1.render(); 
	chart3.render();	
     // update chart after specified time. 
	};
	setInterval(function()
	{
		updateChart()
	}, 1000);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//switch led

function led2() 
{
    if (document.getElementById('led-switch2').checked )
        WS.request('gpio', 'post', [{
            io: 1,
            val: 1
        }]);
    else
        WS.request('gpio', 'post', [{
            io: 1,
            val: 0
        }]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// set led on/off with timers

function seton2()	//time on
{
	setTimeout(()=>{WS.request('gpio', 'post', [{
            io: 1,
            val: 1
	}])},3000);
}

function setoff2()	//time off
{
    setTimeout(()=>{WS.request('gpio', 'post', [{
        io: 1,
        val: 0
	}])},3000);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//auto 

function setauto2() 
{
   if (document.getElementById('setauto-switch2').checked)
        enable1 = true;
    else
        enable1 = false;
}

function setauto3() 
{
   if (document.getElementById('setauto-switch3').checked)
        enable2 = true;
    else
        enable2 = false;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//switch relay

function relay2()
{
	if (document.getElementById('relay-switch2').checked)
        WS.request('gpio', 'post', [{
            io: 13,
            val: 0
        }]);
    else
        WS.request('gpio', 'post', [{
            io: 13,
            val: 1
        }]);
}


























