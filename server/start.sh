#!/bin/bash
## those dirs are needed
pwd
for dir in "data logs"
do
    if [ -d "$dir" ];then mkdir "$dir";fi
done

# Where is node or nodejs (alpine <> debian)
NODEJS="/usr/bin/nodejs"
if [ ! -f "$NODEJS" ];then
    NODEJS="/usr/bin/node"
fi

npm install
## Start application
# Parameters
# listening ip address
# listening port
# Storage: maximum size of the drawing file
#          (2Mo : 2 * 1024 * 1024) = 2097152
IPADDRESS=0.0.0.0 PORT=4000 JSONMAXSIZE=2097152 $NODEJS app.js
