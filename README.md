## About

A React client for monitoring and managing jetstreams in NATS messaging system, written in typescript.

## Stack

<div>
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="60" title="React"/>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201" alt="TypeScript" width="60" title="TypeScript"/>
    <img src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.svg" alt="Redux" height="60" title="Redux"/>
    <img src="https://nats.io/img/logos/nats-horizontal-color.png" alt="NATS" height="60" title="NATS"/>
</div>

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
