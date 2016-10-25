Puck tracker server.

[![Build Status](https://travis-ci.org/AustralianSynchrotron/pucktracker-server.svg?branch=master)](https://travis-ci.org/AustralianSynchrotron/pucktracker-server)

## Installation

### CentOS 7

Requirements:

* [nvm](https://github.com/creationix/nvm)

```
nvm install 4
yum -y groupinstall 'Development Tools
sudo yum install krb5-devel
npm install
```
## API:
Make requests via popup and curl command. e.g.
```
a=$(zenity --entry --text="PLEASE SCAN YOUR DEWAR NOW")

server="SR03BM01HU04WEB01:8080/actions"
header="Content-Type: Application/json"

curl --header "$header" --data "$a" $server
```

## Running

```
NODE_ENV=production npm start
```
