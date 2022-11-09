package logging

import (
	"github.com/guestin/log"
	rotatelogs "github.com/lestrrat-go/file-rotatelogs"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"io"
	"strings"
	"time"
)

// 参考资料：
//	https://www.jianshu.com/p/d729c7ec9c85
//
func init() {
	log.EasyInitConsoleLogger(zapcore.DebugLevel, zapcore.ErrorLevel)
}
func NewFileLogger(tag string, opts ...log.Opt) log.ZapLog {
	return log.NewTaggedZapLogger(getZapLogFile(), tag, opts...)
}
func NewTaggedZapLogger(tag string, opts ...log.Opt) log.ZapLog {
	return log.NewTaggedZapLogger(log.Zap(), tag, opts...)
}
func NewClassicLogger(tag string, opts ...log.Opt) log.ClassicLog {
	return log.NewTaggedClassicLogger(log.Zap(), tag, opts...)
}
func getWriter(filename string) io.Writer {
	// 生成rotatelogs的Logger 实际生成的文件名 demo.log.YYmmddHH
	// demo.log是指向最新日志的链接
	// 保存7天内的日志，每1小时(整点)分割一次日志
	hook, err := rotatelogs.New(
		strings.Replace(filename, ".log", "", -1) + "-%Y%m%d%H.log", // 没有使用go风格反人类的format格式
		//rotatelogs.WithLinkName(filename),
		//rotatelogs.WithMaxAge(time.Hour*24*7),
		//rotatelogs.WithRotationTime(time.Hour),
	)

	if err != nil {
		panic(err)
	}
	return hook
}

func getZapLogFile() *zap.Logger {
	encoder := zapcore.NewConsoleEncoder(zapcore.EncoderConfig{
		MessageKey:  "msg",
		LevelKey:    "level",
		EncodeLevel: zapcore.CapitalLevelEncoder,
		TimeKey:     "ts",
		EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
			enc.AppendString(t.Format("2022-09-02 15:04:05"))
		},
		CallerKey:    "file",
		EncodeCaller: zapcore.ShortCallerEncoder,
		EncodeDuration: func(d time.Duration, enc zapcore.PrimitiveArrayEncoder) {
			enc.AppendInt64(int64(d) / 1000000)
		},
	})
	//encoder := zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())
	debugLevel := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.DebugLevel
	})
	infoWriter := getWriter("./logs/demo_debug.log")
	core := zapcore.NewTee(
		zapcore.NewCore(encoder, zapcore.AddSync(infoWriter), debugLevel),
	)
	zapLog := zap.New(core, zap.AddCaller())
	return zapLog
}
