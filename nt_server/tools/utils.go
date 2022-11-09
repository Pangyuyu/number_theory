package tools

import (
	"errors"
	"github.com/go-playground/locales/zh"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	zh_translations "github.com/go-playground/validator/v10/translations/zh"
	"github.com/labstack/echo/v4"
	"nt_server/logging"
)

var logger = logging.NewLogger("tools")

// CreateValidTrans 创建中文校验
func CreateValidTrans() (*validator.Validate, ut.Translator, error) {
	uni := ut.New(zh.New())
	trans, _ := uni.GetTranslator("zh")
	validate := validator.New()
	err := zh_translations.RegisterDefaultTranslations(validate, trans)
	if err != nil {
		return nil, nil, err
	}
	return validate, trans, nil
}
func CheckValidate(c echo.Context, params interface{}) error {
	validate, trans, err := CreateValidTrans()
	if err != nil {
		return err
	}
	err = c.Bind(params)
	if err != nil {
		return err
	}
	err = validate.Struct(params)
	if err != nil {
		errMsg := ""
		for _, err := range err.(validator.ValidationErrors) {
			errMsg += err.Translate(trans) + ";"
		}
		return errors.New(errMsg)
	}
	return nil
}
