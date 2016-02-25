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

## Running

```
NODE_ENV=production npm start
```
