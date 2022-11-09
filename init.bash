echo "开始执行初始化程序..."
cd ./ota_client
yarn
cd ../ota_server
go get
read -s -n1 -p "初始化项目结束，按任意键结束..."