package tools

import (
	"github.com/guestin/mob/mio"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
	"time"
)

type WsReadInfo struct {
	Action string `json:"action"`
	Params any    `json:"params"`
}

var ChanTaskResult = make(chan int)

// WSListenStartV2 WSListen webSocket监听
func WSListenStartV2(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer mio.CloseIgnoreErr(ws)
		//这里不需要read，只需要write
		for {
			select {
			case v := <-ChanTaskResult:
				_ = websocket.JSON.Send(ws, v)
			default:
				time.Sleep(time.Millisecond * 20)
			}
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
