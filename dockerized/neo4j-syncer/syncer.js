const fs = require('fs');
const request = require('request');
const path = require('path');
const { performance } = require('perf_hooks');
const kafka = require('kafka-node');
const neo4j = require('neo4j');

const db = new neo4j.GraphDatabase('http://localhost:7474');



// const client = new kafka.KafkaClient({kafkaHost: '10.3.100.196:9092'});
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var topics = [{ topic: 'changes' }];
var options = { 
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  kafkaHost: '172.17.0.1:9092',
  protocol: ['roundrobin']

};
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function (message) {
  const value = message.value.split(" ");
  const id = value[0];
  const rev = value[1];

  db.createNode({id, rev}).save(function(err, data) {
    if (err) return console.log(err);
    else console.log(`Synced ${id} ${rev} to neo4j`);
  });
});

consumer.on('error', function (err) {
  console.log('error', err);
});