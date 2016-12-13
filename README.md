# 4me Core Control room mapping service

This software is a webservice providing an API (REST and WebSockets) in charge of handling links between Controler Working Positions (CWP) and sectors.

[![build status](https://gitlab.com/devteamreims/4me.core.mapping/badges/master/build.svg)](https://gitlab.com/devteamreims/4me.core.mapping/commits/master)
[![coverage report](https://gitlab.com/devteamreims/4me.core.mapping/badges/master/coverage.svg)](https://gitlab.com/devteamreims/4me.core.mapping/commits/master)

## How to build and run
```
# git clone
# yarn
# npm start
```

## Purpose of this software
* Identify 4ME clients based on their IP address
* Maintain sector <-> cwp bindings (i.e control room map)
* Persist control room map through app restart

## Configuration
### Environment variables
* `FOURME_ENV`: 4me.env identifier string (learn more here : https://gitlab.com/devteamreims/4me.env)
* `FORCE_CLIENTID` (optional) : Override IP address identification of clients and force a specific clientId

### Configuration files
* `<PROJECT_ROOT>/config/cwpIps.js`: define 4me client id to ip address bindings

## API Description
### HTTP
#### /status
##### GET /
Get app status
#### GET /identify
Returns the 4ME client bound to the requester IP. Overriden by `FORCE_CLIENTID`.  
Returns 404 when no match could be found.

#### /map
##### GET /
Get current control room map
##### POST /
Set control room map
##### GET /(:cwpId)
Get a sectors on a specific CWP

#### /reload
##### GET /
Force reload of all clients

### WebSocket
#### > 'map_updated': newMap
When a new control room map is set, a `map_updated` message is broadcasted to all clients with the new map as payload.

#### > 'mapping:refresh': void
When a new map is set, `mapping:refresh` will be brodcasted to all clients whose sectors / disabled status has changed.

## Database persistence
*Work in progress*
Uses [leveldb](https://github.com/google/leveldb) to store data on the filesystem. Data is stored in `<PROJECT_ROOT>/db` folder.

## Logging
*Work in progress*  
Uses [bunyan](https://github.com/trentm/node-bunyan) to provide JSON log output for OPS LOG.

Dev log uses [debug](https://github.com/visionmedia/debug) for development debug. Turn on debugging by setting the `DEBUG` env variable to `4me.*`.
```
# DEBUG=4me.* npm start
```
