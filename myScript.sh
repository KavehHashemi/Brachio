#!/bin/bash
set -e
${REACT_APP_NATS_SERVER_PATH}nats-server -c server.conf
