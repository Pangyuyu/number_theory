package main

import "C"
import (
	"bytes"
	"container/list"
	"encoding/binary"
	"math/big"
	"unsafe"
)

//CheckIsPrime 判断是否是质数
//export  CheckIsPrime
func CheckIsPrime(a int64) bool {
	if big.NewInt(a).ProbablyPrime(0) {
		return true
	}
	return false
}

//CalcCollatz 3n+1猜想 考拉茨（Collatz）猜想
//export  CalcCollatz
func CalcCollatz(digit uint32) unsafe.Pointer {
	result := digit
	resultList := list.New()
	resultList.PushBack(result)
	for {
		if result == 1 {
			break
		}
		if result%2 == 0 {
			result = result / 2
		} else {
			result = result*3 + 1
		}
		resultList.PushBack(result)
	}
	res := make([]uint32, resultList.Len()+1)
	res[0] = uint32(resultList.Len())
	index := 0
	for i := resultList.Front(); i != nil; i = i.Next() {
		index++
		res[index] = i.Value.(uint32)
	}
	buf := new(bytes.Buffer)
	err := binary.Write(buf, binary.BigEndian, res)
	if err != nil {
		panic(err)
	}
	return C.CBytes(buf.Bytes())
}

func main() {

}
