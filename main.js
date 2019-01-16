//@ts-check

"use strict";

const http = require('http');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const HTML_DIR_PATH = '/html/index.html';

var progressnum = 0;

let server = http.createServer(httpServer);
server.listen('3030');

function httpServer(req, res) {
    if (req.url == '/favicon.ico') {
        res.end();
        return;
    }

    if (req.url == '/start_encode') {
        res.write("encodeStarting...");

        start_encode();
        res.end("starting");
        return
    }

    if (req.url == '/progress') {
        res.write(progressnum.toString());
        res.end();
        return
    }

    //静的ファイルの送信

    console.log(req.url);
    console.log(__dirname + HTML_DIR_PATH);
    if (req.url == "/") {

        fs.readFile (__dirname + HTML_DIR_PATH, 'UTF-8', function (err, data) {
            if(err) {

                console.log(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('notfound!!');
                return res.end();

            }else{
                res.writeHead(200, {'Contetnt-Type': 'text/html'});
                res.write(data);
                return res.end();
        }})
    } else {
        fs.readFile (__dirname + req.url, 'UTF-8', function (err, data) {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('notfound!!');
                return res.end();

            }else{
                res.writeHead(200, {'Contetnt-Type': 'text/html'});
                res.write(data);
                return res.end();
        }})
    }
}

function Setup_EncodeOption () {

}

function start_encode () {
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