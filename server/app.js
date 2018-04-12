'use strict';
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = require('express')();

const http = require('http').Server(app);
const io = require('socket.io')(http);

let participants = 0;

const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})

db.connect(function (err) {
  if (!err) console.log('connected to db')

  if (err) console.log(err)
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
  });

  socket.on('add-message', (message, date) => {
    console.log(message);
    db.query('INSERT INTO chat_messages SET ?', message, function (err, result) {
      if (err) console.log('error inserting');
    });
    io.to(message.msg_channel).emit('message', { type: 'new-message', msg_sender: message.msg_sender, msg_content: message.msg_content, msg_channel: message.msg_channel, msg_date: date });
  });

  socket.on('get-old-messages', (data) => {
    let messages = [];
    db.query('SELECT * FROM chat_messages WHERE msg_channel = ? ORDER BY msg_date ASC', data)
      .on('result', function (result) {
        // Push results onto the notes array
        messages.push(result);
      })
      .on('end', function () {
        // Only emit notes after query has been completed
        socket.emit('old-messages', messages);
      })
  })

  socket.on('get-channels', () => {
    let channels = [];
    db.query('SELECT ch_id,ch_name, COUNT(chat_messages.msg_channel) AS count FROM chat_channels LEFT JOIN chat_messages ON chat_channels.ch_id=chat_messages.msg_channel GROUP BY chat_channels.ch_id')
      .on('result', function (result) {
        // Push results onto the notes array
        channels.push(result);

      })
      .on('end', function () {
        // Only emit notes after query has been completed
        console.log(channels);
        socket.emit('new-channels', channels);
      })
  })

  socket.on('join_channel', (data) => {
    socket.join(data);
    const sids = io.sockets.adapter.rooms[data].sockets
    io.sockets.emit("users", { sids });
    console.log(socket.id, 'joined channel:', data);
  });
});

http.listen(5000, () => {
  console.log('started on port 5000 on sessionId');
});

