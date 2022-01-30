const fs = require('fs');
const path = require('path');

let fileStart;
let fileEnd;
let fileTotal;
/*
const fileStats = (file, response) => {
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
    }
    return response.end(err);
  });
};
*/
const getByteRange = (file, response, request) => {
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    fileStart = start;
    fileEnd = end;
    fileTotal = total;
    /*
    console.log(start);
    console.log(end);
    console.log(total);
    console.log(fileStart);
    console.log(fileEnd);
    console.log(fileTotal);
    */
  });
};

const sendByteRange = (start, end, total, response, contentType) => {
  const chunksize = (end - start) + 1;
  response.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': contentType,
  });
};

const createStream = (file, response, start, end) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

const getParty = (request, response) => {
  const file = path.resolve(__dirname, '../client/party.mp4');
  // fileStats(file, response);
  getByteRange(file, response, request);
  sendByteRange(fileStart, fileEnd, fileTotal, response, 'video/mp4');
  createStream(file, response, fileStart, fileEnd);
};

const getBling = (request, response) => {
  const file = path.resolve(__dirname, '../client/bling.mp3');
  // fileStats(file, response);
  getByteRange(file, response, request);
  sendByteRange(fileStart, fileEnd, fileTotal, response, 'audio/mpeg');
  createStream(file, response, fileStart, fileEnd);
};
const getBird = (request, response) => {
  const file = path.resolve(__dirname, '../client/bird.mp4');
  // fileStats(file, response);
  getByteRange(file, response, request);
  sendByteRange(fileStart, fileEnd, fileTotal, response, 'video/mp4');
  createStream(file, response, fileStart, fileEnd);
};

// Commented out starter code
/*
const getParty = (request, response) => {
  const file = path.resolve(__dirname, '../client/party.mp4');

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });

    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};
*/
module.exports = {
  getParty,
  getBird,
  getBling,
};
