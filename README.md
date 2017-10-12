Puck tracker server.

[![Build Status](https://travis-ci.org/AustralianSynchrotron/pucktracker-server.svg?branch=master)](https://travis-ci.org/AustralianSynchrotron/pucktracker-server)

## Installation

### CentOS 7

Requirements:

* node v5 or v6
* mongodb

```
yum -y groupinstall 'Development Tools
sudo yum install krb5-devel
npm install -g yarn
yarn
```

## Running

```
NODE_ENV=production npm start
```

## Development

```
docker-compose -f docker-compose.dev.yml up -d --build
```

Test:

```
docker-compose -f docker-compose.dev.yml run server test
```


## API

Make requests via popup and curl command:

```
action=$(zenity --entry --text="PLEASE SCAN YOUR DEWAR NOW")
server="SR03BM01HU04WEB01:8080/actions"
header="Content-Type: Application/json"
curl --header "$header" --data "$action" $server
```
