package tools

import (
	"github.com/labstack/echo/v4"
	"math/big"
)

func CheckIsPrime(c echo.Context) error {

	return nil
}
func checkIsPrime(a int64) bool {
	if big.NewInt(a).ProbablyPrime(0) {
		return true
	}
	return false
}
