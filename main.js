"use strict";

const http = require('http');
const ffmpeg = require('fluent-ffmpeg');

var progressnum = 0;

let server = http.createServer(httpServer);
server.listen('3030');

function httpServer(req, res) {
    if(req.url == '/favicon.ico') {
        res.end();
        return;
    }

    if(req.url == '/start_encode') {
        res.write("encodeStarting...");

        start_encode();
        res.end("starting");
        return;
    }

    res.write(progressnum.toString());
    res.end();

    return;
}

function start_encode() {
    ffmpeg('/path/to/file.avi')
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .size('320x240')
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })

        .on('end', function() {
            console.log('Processing finished !');
            progressnum = -1;
        })

        ffmpeg('/path/to/file.avi')
        .on('progress', function(progress) {
          console.log('Processing: ' + progress.percent + '% done');
          progressnum = progress.percent;
        })

    .save('/path/to/output.mp4');

}