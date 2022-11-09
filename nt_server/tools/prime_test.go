package tools

import (
	"bufio"
	"fmt"
	"os"
	"testing"
)

func TestCheckIsPrime01(t *testing.T) {
	for i := 1; i < 10; i++ {
		start := 100000000 * i
		end := start + 100000000
		filePath := fmt.Sprintf("./prime_%d_%d.txt", start, end)
		file, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			fmt.Println(fmt.Errorf("文件打开失败"))
			return
		}
		defer file.Close()
		write := bufio.NewWriter(file)
		count := 0
		for j := start; j < end; j++ {
			checkRes := CheckIsPrime(int64(j))
			if checkRes {
				count++
				_, err := write.WriteString(fmt.Sprintf("%d\n", j))
				if err != nil {
					fmt.Println(fmt.Errorf("文件写入失败,%s", err))
					return
				}
				if count >= 1000 {
					count = 0
					write.Flush()
				}
			}
		}
		write.Flush()
	}
}
func TestCheckIsPrime02(t *testing.T) {
	a := 99999999997
	checkRes := CheckIsPrime(int64(a))
	if checkRes {
		fmt.Println(a, "是 质数")
	} else {
		fmt.Println(a, "是 合数")
	}
}
