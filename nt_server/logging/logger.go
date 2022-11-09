package logging

import (
	"github.com/guestin/log"
	"go.uber.org/zap"
)

type Logger struct {
	logConsole log.ZapLog
	logFile    log.ZapLog
}

func NewLogger(tag string, opts ...log.Opt) Logger {
	return Logger{
		logConsole: NewTaggedZapLogger(tag, opts...),
		logFile:    NewFileLogger(tag, opts...),
	}
}

func (this *Logger) Debug(msg string, fields ...zap.Field) {
	this.logConsole.Debug(msg, fields...)
	this.logFile.Debug(msg, fields...)
}
func (this *Logger) Info(msg string, fields ...zap.Field) {
	this.logConsole.Info(msg, fields...)
	this.logFile.Info(msg, fields...)
}
func (this *Logger) Error(msg string, fields ...zap.Field) {
	this.logConsole.Error(msg, fields...)
	this.logFile.Error(msg, fields...)
}
