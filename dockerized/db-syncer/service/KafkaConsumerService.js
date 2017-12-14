const kafka = require('kafka-node');
const ConsumerGroup = kafka.ConsumerGroup;

class KafkaConsumerService {
  constructor(topic) {
    var options = { 
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      kafkaHost: 'kafka:9092',
      protocol: ['roundrobin']
    };

    const consumer = new ConsumerGroup(options, [topic]);

    consumer.on('error', function (err) {
      console.log("KAFKA RELATED ERROR!!!", err);
    });

    this.consumer = consumer;
  }

  onMessage(callback) {
    this.consumer.on('message', callback);
  }
}

module.exports = KafkaConsumerService;