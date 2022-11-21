package tools

import (
	"container/list"
)

// CalcCollatz 3n+1猜想 考拉茨（Collatz）猜想
func CalcCollatz(digit uint64) *list.List {
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
	return resultList
}
