document.getElementById("test").innerHTML = "WebSocket is not connected";

const msg_types = {
    EVT: 0,
    CMD: 1
};

const evt_ids = {
    SYS_STATUS: 0,
    MEDIA_STATUS: 1
};

var websocket = new WebSocket('ws://' + location.hostname + '/');
var slider = document.getElementById("myRange");

slider.oninput = function () {
    websocket.send("L" + slider.value);
};

function sendMsg() {
    websocket.send('L50');
    console.log('Sent message to websocket');
}

function sendText(text) {
    websocket.send("M" + text);
}

websocket.onopen = function (evt) {
    console.log('WebSocket connection opened');
    websocket.send("It's open! Hooray!!!");
    document.getElementById("test").innerHTML = "WebSocket is connected!";
};

websocket.onmessage = function (evt) {
    var msg = evt.data;
    console.log(msg);
    var obj = JSON.parse(msg);
    switch (obj.type) {
        case msg_types.EVT:
        switch (obj.id) {
            case evt_ids.SYS_STATUS:
                value = parseInt(obj.cpu, 10);
                slider.value = value;
                document.getElementById("status").innerHTML = msg;
                break;
            case evt_ids.MEDIA_STATUS:
                document.getElementById("output").innerHTML = msg;
                break;
            default:
                console.log("Not implemented");
                break;
        }
        default:
            console.log("Not implemented");
            break;
    }
};

websocket.onclose = function (evt) {
    console.log('Websocket connection closed');
    document.getElementById("test").innerHTML = "WebSocket closed";
};

websocket.onerror = function (evt) {
    console.log('Websocket error: ' + evt);
    document.getElementById("test").innerHTML = "WebSocket error????!!!1!!";
};
