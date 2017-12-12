const fs = require('fs');
const request = require('request');
const path = require('path');
const { performance } = require('perf_hooks');
const kafka = require('kafka-node');
const neo4j = require('neo4j');

setTimeout(function() {
  const db = new neo4j.GraphDatabase('http://localhost:7474');

  var ConsumerGroup = kafka.ConsumerGroup;
  var topics = ['changes'];
  var options = { 
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    kafkaHost: '172.17.0.1:9092',
    protocol: ['roundrobin']
  };
  var consumer = new ConsumerGroup(options, topics);

  console.log('ok doing stuff');

  consumer.on('message', function (message) {
    console.log("WTFFFF MESSAGE!!!");
    console.log(message);
    const value = message.value.split(" ");
    const id = value[0];
    const rev = value[1];

    db.cypher({
      query: `CREATE (n:Package { id: {id}, rev: {rev}})`,
      params: { id, rev }
    }, function(err, data) {
      if (err) return console.log(err);
      else console.log(`Synced ${id} ${rev} to neo4j`);
    });
  });

  consumer.on('error', function (err) {
    console.log("WTFFFF ERROR!!!");
    console.log('error', err);
  });
}, 5000);
