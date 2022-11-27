## About

A React client for monitoring and managing jetstreams in NATS messaging system, written in typescript.

## Configuration

Use [connectionconfig.json](https://github.com/KavehHashemi/nats-react-ts/blob/master/src/connectionconfig.json) in src folder to change the server URL for your NATS.ws connection.

For more information about NATS and customizing the server.conf file refer to [NATS documentation](https://docs.nats.io/).

## Environment

- Download & Install [GO](https://go.dev/doc/install)

- Download [NATS-Server](https://github.com/nats-io/nats-server/releases)

- Add NATS' path to windows

## Starting Up

- Install react app

  #### `npm install`

- Run NATS-Server

  #### `nats-server -c server.conf`

- Run React app

  #### `npm start`
