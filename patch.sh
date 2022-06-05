#!/bin/bash
##############################################################
## D.HENRY (https://www.mytindydc.com)
# (required) API nodejs compliant
# (Optional) : UserReport because i don't want third party in the running app
#              So default is keeping, to remove from source, execute : 
#              ./patch.sh "optional"
##############################################################
echo "Option $1"
echo "[INFO]Starting applying patches..."

## required for nodejs-server
match="(const API_URL.*)(https:\/\/api.mydraft.cc)(.*)$"
file="ui/src/wireframes/model/actions/loading.ts"
echo "[Patching]$match-$file"
# i replace https://api.mydraft.cc with ''
sed -i -E "s,$match,\1\3," "$file"
echo "  [INFO]done"

## required for nodejs-server
echo "[Patching]Replacing load route / with /get"
sed -i 's,${API_URL}/${args.tokenToRead},${API_URL}/get/${args.tokenToRead},' "$file"
if [ "$?" != "0" ];then exit 1;fi

echo "  [INFO]done"

## required for nodejs-server
## ContentType ERR Content-Type and application/json (needed for express body-parser)
echo "[Patching]ContentType-application/json"
sed -i -E "s,ContentType.*text\/json(.*)$,'Content-Type': 'application\/json\1," "$file"
if [ "$?" != "0" ];then exit 1;fi
echo "  [INFO]done"


##########Optional - execute with parameter "optional"
if [ "$1" == "optional" ];then
	## Usefull for ... me :)
	echo "[Patching]Removing UserReport from application"
	## Remove UserReport support
	if [ -f "ui/src/core/react/UserReport.tsx" ];then
		rm -r ui/src/core/react/UserReport.tsx
		if [ "$?" != "0" ];then exit 1;fi
	fi
	## Patch tsx
	files=$(grep -r "UserReport" ui/src | awk -F  ":"  '{print $1}' |uniq |xargs)
	for f in $files
	do
		echo "  [INFO]Patching UserReport in $f"
		sed -i -E 's/.*UserReport.*//' "$f"
		if [ "$?" != "0" ];then exit 1;fi
	done
	echo "  [INFO]done"
else
	echo "[Patching]UserReport was kept, to remove it, restart : ./patch.sh \"optional\""
fi
##############################
