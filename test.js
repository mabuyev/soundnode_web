
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
        CmdPrev: 7,
        CmdSetVol: 8
    };
    
const target = {
        CmdTargetPlayer: 0,
        CmdTargetMedia: 1
};

const websocket = new WebSocket('ws://' + location.hostname + '/');
const slider = document.getElementById("myRange");
var mediaStatus = new Object();
var volume = 0;

slider.oninput = function () {
    var newVol = parseInt(slider.value);
    if(newVol === volume)
        return;
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    cmdObj.cmd = command.CmdSetVol;
    cmdObj.param = newVol;
    volume = newVol;
    websocket.send(JSON.stringify(cmdObj));
};

function sendPlayResume(uri, name) {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    if(mediaStatus.paused === 1) {
        cmdObj.cmd = command.CmdResume;
    } else {
        cmdObj.cmd = command.CmdPlay;
        cmdObj.uri = uri;
        if(name !== null) {
            cmdObj.name = name;
        } else {
            cmdObj.name = uri;
        }
    }
    websocket.send(JSON.stringify(cmdObj));
};

function sendPause() {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    if(mediaStatus.paused !== 1) {
        cmdObj.cmd = command.CmdPause;
        websocket.send(JSON.stringify(cmdObj));
    }
}

function sendStop() {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    if(mediaStatus.playing === 1) {
        cmdObj.cmd = command.CmdStop;  
    }
    websocket.send(JSON.stringify(cmdObj));
}

function sendMute() {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    cmdObj.cmd = command.CmdMute;  
    websocket.send(JSON.stringify(cmdObj));
}

function sendUnmute() {
    var cmdObj = new Object();
    cmdObj.target = target.CmdTargetPlayer;
    cmdObj.cmd = command.CmdUnmute;  
    websocket.send(JSON.stringify(cmdObj));
}

websocket.onopen = function (evt) {
    console.log('WebSocket connection opened');
    document.getElementById("header").style.background='#666';
    document.getElementById("pause").style.display = "none";
    document.getElementById("mute").style.display = "none";
    document.getElementById("unmute").style.display = "none";
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
                mediaStatus = obj;
                document.getElementById("output").innerHTML = msg;
                if(obj.playing === 1) {
                    if(obj.paused === 1) {
                        document.getElementById("stitle").innerHTML = "Paused: " + obj.name;
                        document.getElementById("pause").style.display = "none";
                    } else {
                        document.getElementById("stitle").innerHTML = "Playing: " + obj.name;
                        document.getElementById("pause").style.display = "block";
                    }
                }
                volume = obj.volume;
                slider.value = volume;
                break;
            default:
                console.log("Message ID not implemented: " + obj.id);
                break;
        }
        break;
    case msg_types.RESP:
        console.log("Response: " + msg);
        document.getElementById("test").innerHTML = msg;
        break;
    default:
        console.log("Message type not implemented: " + obj.type);
        break;
    }
};

websocket.onclose = function (evt) {
    console.log('Websocket connection closed');
    document.getElementById("test").innerHTML = "WebSocket closed";
    document.getElementById("header").style.background='red';
};

websocket.onerror = function (evt) {
    console.log('Websocket error: ' + evt);
    document.getElementById("test").innerHTML = "WebSocket error????!!!1!!";
};
