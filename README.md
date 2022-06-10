# Minimalist Nodejs server for mydraft application

see :

- https:/mydraft.cc
- https://github.com/mydraft-cc/ui

**WARNING** :
This code is not a fork of "mydraftcc/ui" (https://mydraft.cc), the source code of "mydraftcc/ui" must be available at build time (https://github.com/mydraft-cc/ui).
Once the code is retrieved, i apply patches to make the "mydraftcc/ui" application compatible with the nodejs API server, and (optional) remove the code related to "UserReport".

## Installation

Legacy or Docker

### Legacy

```
# get sources
git clone https://github.com/mydraft-cc/server-node.git --recursive
cd server-node
# Required
./patch.sh
# if you want to remove UserReport from the application :
# ./patch.sh "optional"
# execute once only to install npm packages and to build ui
cd ui && npm install && npm run build && mkdir ../server/{public,data} && cp -R build/* ../server/public/ && cd ..
cd server && ./start.sh
#You could set environment parameters in server/start.sh
```

### Docker

To build image :

```
docker build --no-cache --force-rm -t mydraftcc-nodejs-server .
```

if you want to remove UserReport from the application, add `--build-arg PATCHOPTIONS=optional` :

```
docker build --build-arg PATCHOPTIONS=optional --no-cache --force-rm -t mydraftcc-nodejs-server .
```

## File webpack.config.js-forlocaldeveloppementwithserver

Copy this file to "ui/config/webpack.config.js" for debug session. All API request will be sent to the localhost:4000 server...
**You need** to apply "patch.sh" before debugging UI with the nodejs server.

```
git submodule update --init
cp webpack.config.js-forlocaldeveloppementwithserver ui/config/webpack.config.js
./patch.sh
cd ui && npm run start
## start your debugging session
```

## To use the application

Once your server is started, just open your favorite Browser (firefox) and enter http://[server Ip address]:4000/

## Swagger

API documentation could be reached at [your server]:/api-docs/
Very usefull to debug API server

Start the server, and call the page /api-docs, play with API

```
./start.sh
# Open browser, call http://localhost:4000/api-docs/
```

## Security

As you can see, server is not protected by login/password, no TLS transport. You should use it as a personal service.  
If you decide to expose it on internet, you must installed this service behind reverse proxy (haproxy, nginx) with TLS,
**and monitor volume space used**...

enjoy+++ Damien
