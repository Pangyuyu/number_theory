package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"errors"
	"nt_server/logging"
)

//参考资料：https://www.jianshu.com/p/0caab60fea9f
var aseLog = logging.NewLogger("aeshelper")

//PwdKey 密钥
var PwdKey = []byte{
	229, 174, 162, 231, 148,
	186, 45, 50, 48, 50,
	50, 229, 185, 180, 55,
	230, 156, 136, 49, 56,
	230, 151, 165, 32}

//pkcs7Padding 填充
func pkcs7Padding(data []byte, blockSize int) []byte {
	//判断缺少几位长度。最少1，最多 blockSize
	padding := blockSize - len(data)%blockSize
	//补足位数。把切片[]byte{byte(padding)}复制padding个
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padText...)
}

//pkcs7UnPadding 填充的反向操作
func pkcs7UnPadding(data []byte) ([]byte, error) {
	length := len(data)
	if length == 0 {
		aseLog.Debug("加密字符串错误！")
		return nil, errors.New("加密字符串错误！")
	}
	//获取填充的个数
	unPadding := int(data[length-1])
	return data[:(length - unPadding)], nil
}

//AesEncrypt 加密
func aesEncrypt(data []byte, key []byte) ([]byte, error) {
	//创建加密实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//判断加密快的大小
	blockSize := block.BlockSize()
	//填充
	encryptBytes := pkcs7Padding(data, blockSize)
	//初始化加密数据接收切片
	crypto := make([]byte, len(encryptBytes))
	//使用cbc加密模式
	blockMode := cipher.NewCBCEncrypter(block, key[:blockSize])
	//执行加密
	blockMode.CryptBlocks(crypto, encryptBytes)
	return crypto, nil
}

//AesDecrypt 解密
func aesDecrypt(data []byte, key []byte) ([]byte, error) {
	//创建实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//获取块的大小
	blockSize := block.BlockSize()
	//使用cbc
	blockMode := cipher.NewCBCDecrypter(block, key[:blockSize])
	//初始化解密数据接收切片
	crypto := make([]byte, len(data))
	//执行解密
	blockMode.CryptBlocks(crypto, data)
	//去除填充
	crypto, err = pkcs7UnPadding(crypto)
	if err != nil {
		return nil, err
	}
	return crypto, nil
}

//EncryptByAes Aes加密 后 base64 再加
func encryptByAes(data []byte) (string, error) {
	res, err := aesEncrypt(data, PwdKey)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(res), nil
}

//DecryptByAes Aes 解密
func decryptByAes(data string) ([]byte, error) {
	dataByte, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, err
	}
	return aesDecrypt(dataByte, PwdKey)
}
