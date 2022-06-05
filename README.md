# Minimalist Nodejs server for mydraft application (https:/mydraft.cc)

## Installation

**WARNING** :
This code is not a fork of "mydraftcc/ui" (https://mydraft.cc), the source code of "mydraftcc/ui" must be available at build time (https://github.com/mydraft-cc/ui).
Once the code is retrieved, i apply patches to make the xxx application compatible with the nodejs API server, and (optional) remove the code related to "UserReport".

### No docker

```
# Required
./patch.sh
# if you want to remove UserReport from the application :
#./patch.sh "optional"
cd server && npm install && ./start.sh
#You could set environment parameters in server/start.sh
```

### Docker

## Execute

## Swagger

pay **ATTENTION**
