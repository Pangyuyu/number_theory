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

func init() {
	flag.StringVar(&port, "p", "60001", "本地服务启动端口号")
	flag.StringVar(&magic, "m", "", "")
}

//Golang之信号处理（Signal） https://zhuanlan.zhihu.com/p/128953024
func main() {
	flag.Parse()
	e := echo.New()
	address := fmt.Sprintf(":%s", port)
	mainLog.Debug("start server", zap.String("port", address))
	apiGroup := e.Group("/api").
		Group("/number").
		Group("/theory")
	apiGroup.Use(middleware.Recover())
	apiGroup.Use(middleware.CORS())
	apiGroup.GET("/ws/listen", tools.WSListenStartV2)
	//apiGroup.GET("/prime/check", tools.CheckIsPrime)
	e.Logger.Fatal(e.Start(address))

}
