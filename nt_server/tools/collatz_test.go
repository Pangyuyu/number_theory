package tools

import (
	"fmt"
	"testing"
)

func TestCalcCollatz(t *testing.T) {
	for i := 1; i <= 100; i++ {
		rList := CalcCollatz(uint64(i))
		fmt.Printf("[%d] ", rList.Len())
		for i := rList.Front(); i != nil; i = i.Next() {
			fmt.Printf("%d ", i.Value)
		}
		fmt.Println("\r")
	}
	fmt.Println("\r")
}
