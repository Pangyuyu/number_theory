package main

import (
	"flag"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
	"nt_server/logging"
	"nt_server/tools"
)

var port string //本地服务启动的端口号
var magic string

var mainLog = logging.NewLogger("MAIN")

const _magic = "uaow43ri7asokdlfy99321lsdjf"

func init() {
	flag.StringVar(&port, "p", "40001", "本地服务启动端口号")
	flag.StringVar(&magic, "m", "", "")
}

//Golang之信号处理（Signal） https://zhuanlan.zhihu.com/p/128953024
func main() {
	flag.Parse()

	if magic != _magic {
		mainLog.Debug("权限校验失败，禁止调用此程序!")
		return
	}
	e := echo.New()
	address := fmt.Sprintf(":%s", port)
	mainLog.Debug("start server", zap.String("port", address))
	apiGroup := e.Group("/api").
		Group("/v1").
		Group("/number-theory")
	apiGroup.Use(middleware.Recover())
	apiGroup.Use(middleware.CORS())
	apiGroup.GET("/ws/listen", tools.WSListenStartV2)
	e.Logger.Fatal(e.Start(address))
}
