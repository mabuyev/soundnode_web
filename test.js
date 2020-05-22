document.getElementById("test").innerHTML = "WebSocket is not connected";

const msg_types = {
    EVT: 0,
    CMD: 1,
    RESP: 2
};

const evt_ids = {
    SYS_STATUS: 0,
    MEDIA_STATUS: 1
};

 const command = {
        CmdPlay: 0,
        CmdStop: 1,
        CmdPause: 2,
        CmdResume: 3,
        CmdMute: 4,
        CmdUnmute: 5,
        CmdNext: 6,
        CmdPrev: 7         
    };
    
const target = {
        CmdTargetPlayer: 0,
        CmdTargetMedia: 1
};

const websocket = new WebSocket('ws://' + location.hostname + '/');
const slider = document.getElementById("myRange");
const prbutton = document.getElementById("prbutton");

slider.oninput = function () {

};

function sendText(text) {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    cmdObj.cmd = command.CmdPlay;
    cmdObj.uri = text;  
    websocket.send(JSON.stringify(cmdObj));
};

function sendPauseResume() {
    var cmd = prbutton.innerHTML;
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    
    if(cmd === "Pause") {
        cmdObj.cmd = command.CmdPause;
        prbutton.disabled = true;
    } else if(cmd === "Resume") {
        cmdObj.cmd = command.CmdResume;  
        prbutton.disabled = true;
    }
    websocket.send(JSON.stringify(cmdObj));
}

websocket.onopen = function (evt) {
    console.log('WebSocket connection opened');
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
                document.getElementById("status").innerHTML = msg;
                break;
            case evt_ids.MEDIA_STATUS:
                document.getElementById("output").innerHTML = msg;
                document.getElementById("prbutton").innerHTML = obj.paused === 1 ? 'Resume' : 'Pause';
                prbutton.disabled = false;
                slider.value = obj.pos/obj.dur;
                break;
            default:
                console.log("Message ID not implemented: " + obj.id);
                break;
        }
        break;
    case msg_types.RESP:
        console.log("Response: " + msg);
        break;
    default:
        console.log("Message type not implemented: " + obj.type);
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
