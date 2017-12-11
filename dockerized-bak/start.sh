#!/bin/bash
docker-compose up -d --build;
echo "Sleeping for some time...";
sleep 3;
echo "Waking up";
curl -X PUT http://127.0.0.1:5984/registry;
curl -H "Content-Type: application/json" -X POST -d '{"_id": "npmjs", "source": "https://replicate.npmjs.com/registry", "target": "registry", "continuous": false, "create_target": true}' http://127.0.0.1:5984/_replicator;
docker-compose logs -f;