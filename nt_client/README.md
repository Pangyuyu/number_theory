# 项目说明

## 使用yarn

- 安装nvm
- 安装node 16.15.0
- corepack enable
- corepack prepare yarn@1.22.19 --activate
- yarn
- yarn electron:dev

PS:暂时放弃使用yarn3，因为未找到对于特定包的国内源的配置方式;

## 关于目录

|目录名称|说明|
|--|--|
|dist|前端代码构建结果|
|dist_electron|electron编译结果|
|main|主进程逻辑|
|resources|资源文件，里面的文件会复制到安装目录中的resources|
|shell-chrome|chrome开发者工具插件，只在开发阶段使用|
|src|前端目录|
