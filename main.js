"use strict";

//moudles

const http = require('http');
const child_process = require(`child_process`);
const fs = require('fs')

//Code

var frame = 0;

let server = http.createServer(httpServer);
child_process.exec("ffprobe -show_streams -hide_banner -print_format json 01.mp4", (error, stdout, stderr) => {
    if (error) {
        console.error(`[ERROR] ${error}`);
        return;
    }
    let json = JSON.parse(stdout);

    frame = json.streams[0].nb_frames;
});

child_process.exec("ffmpeg -i ./01.mp4 -y -nostdin -s 128x72 04.mp4 -f mpegts 1>output.txt 2>&1", (error, stdout, stderr) => {
    if (error) {
        console.error(`[ERROR] ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

server.listen("3000");

function read(filePath) {
    var content = new String();
    if(check(filePath)) {;
      content = fs.readFileSync(filePath, 'utf8');
    }
    return content;
};

function check(filePath) {
    var isExist = false;
    try {
      fs.statSync(filePath);
      isExist = true;
    } catch(err) {
      isExist = false;
    }
    return isExist;
}

function httpServer(req, res) {

    if (req.url === '/favicon.ico') {

        console.log("Deal");
        res.end();
        return;
    }

    let str = read("output.txt");
    let result = str.match(/frame=\s*(\d*)\s/g);

    console.log(result.length);
    console.log(result[result.length-1]);

    let final = result[result.length-1];

    console.log(final.match(/\d+/))
    res.write((final.match(/\d+/)[0]/frame) * 100 + "%");
    res.end();
}