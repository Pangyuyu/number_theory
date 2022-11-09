#!/bin/bash
echo "正在编译数论示例本地服务"
if [[ "$OSTYPE" =~ ^msys ]];then
  (go build -o ../ota_client/resources/server/nunber-theory-local-server.exe -ldflags="-s -w" main.go)
elif [[ "$OSTYPE" =~ ^linux ]]; then
  (build -o ../ota_client/resources/server/nunber-theory-local-server -ldflags="-s -w" main.go)
else
  echo "暂不支持该操作系统,$OSTYPE"
fi
# shellcheck disable=SC2162
read -s -n1 -p "数论示例本地服务完成,按任意键继续"
