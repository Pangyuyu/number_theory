package tools

import "math/big"

func CheckIsPrime(a int64) bool {
	if big.NewInt(a).ProbablyPrime(0) {
		return true
	}
	return false
}
