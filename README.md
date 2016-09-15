# 4me Core Control room mapping service

This software is a webservice providing an API (REST and WebSockets) in charge of handling links between Controler Working Positions (CWP) and sectors.

[![build status](https://gitlab.com/devteamreims/4me.core.mapping/badges/master/build.svg)](https://gitlab.com/devteamreims/4me.core.mapping/commits/master)
[![coverage report](https://gitlab.com/devteamreims/4me.core.mapping/badges/master/coverage.svg)](https://gitlab.com/devteamreims/4me.core.mapping/commits/master)

## How to build and run
```
# npm install
# npm start
```

## Purpose of this software
* Define all 4ME clients
* Identify these clients based on their IP address
* Define all sectors and sector groups
* Maintain sector <-> cwp bindings
* Offer splitting/collapsing suggestions based on the state of the control room
* Persist control room map through app restart

## Configuration

### Clients and CWPs
#### Define all CWPs
First you must configure all possible 4ME clients.

This is done in ```config/cwps```.

This configuration will then be imported in the app like so :
```javascript
import CWPs from ./config/cwps
```

You must export an array of objects like so :
```javascript
[
  {
    "id": 1,
    "name": "CDS",
    "type": "supervisor"
  },
  ...
]
```

Must be unique, required

##### name (string)
Display name of the client
Will default to ```P12``` where 12 is the ID of the CWP

##### type (string)
Valid types are :
* supervisor : control room ops supervisor
* tech-supervisor : technical supervisor
* flow-manager : flow manager position
* cwp (default) : normal CWP

##### suggestions (object)
4me.core.mapping is able to suggest specific sectors when opening/collapsing sector groups.
* filteredSectors (array) : sectors that won't be suggested ever on this CWP
* preferenceOrder (array) : affects suggestion order, will put preferred suggestions first

This is only valid for ```cwp``` type.

###### backupedRadios (array)
Work in progress, undocumented feature.

#### Client identification

4me.core.mapping needs a way to identify clients. All clients run the same software, and therefore, can't identify themselves.

4me.core.mapping will identify clients based on their IP adresses.

This configuration is defined in ```config/cwpIps.js```

This file must export an array of objects.

Each object has a ```cwpId``` key which references a specific client id.
Each object also has an ```ipAddr``` key.

### Sectors
```config/sectors``` default export must be an array of objects

Each object stands for a known sector group.

#### name (string)
Name of the sector group (required)

#### elementarySectors (array)
Array of elementary sectors

#### canAccept (array)
Array of sector names. Used for suggestions.
This represents which other sectors or sector groups given sector can accept.

#### canGive (array)
Array of sector names. Used for suggestions.
This represents sectors or sector groups that given sector can give.

## API Description
### HTTP
#### /status
##### GET /
Get app status
#### /cwp
##### GET /
Get all CWPs
##### GET /(:cwpId)
Get a specific CWP
##### GET /getMine
Returns a specific CWP based on client IP address
#### /sectors
##### GET /
Get every sector group defined
#### /mapping
##### GET /
Get current control room map
##### POST /
Set control room map
##### GET /cwp/(:cwpId)
Get a sectors on a specific CWP
##### GET /cwp/(:cwpId)/suggest
Get suggestions on a specific CWP
#### /reload
##### GET /
Force reload of all clients
### WebSocket

## Database persistence

## Logging
