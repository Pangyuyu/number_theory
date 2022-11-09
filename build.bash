#!/bin/bash
# 进入到本地服务目录，编译go程序
cd ./ota_server
# (go env -w GOARCH=386)
echo "正在编译820li本地服务"
if [[ "$OSTYPE" =~ ^msys ]];then
    echo "正在编译本地服务(windows)"
  (GOARCH=386 go build -o ../nt_client/resources/server/nunber-theory-local-server.exe -ldflags="-s -w" main.go)
elif [[ "$OSTYPE" =~ ^linux ]]; then
  echo "正在编译本地服务(linux)"
  (GOARCH=386 go build -o ../nt_client/resources/server/nunber-theory-local-server -ldflags="-s -w" main.go)
else
  echo "暂不支持该操作系统,$OSTYPE"
fi
# shellcheck disable=SC2162
echo "820Li本地服务编译完成!"
echo "============================================="

# 进入到客户端目录，根据不同操作系统编译
cd ../ota_client
if [[ "$OSTYPE" =~ ^msys ]];then
  echo "正在编译客户端程序(windows)"
  (yarn electron:build.exe_x86)
  read -s -n1 -p "编译完成，按任意键结束..."
  start ..\\release
elif [[ "$OSTYPE" =~ ^linux ]]; then
  echo "正在编译客户端程序(Linux deb)"
  (yarn electron:build.linux.deb)
  read -s -n1 -p "编译完成，按任意键结束..."
  open ../release
else
  echo "暂不支持该操作系统,$OSTYPE"
fi
echo ""
