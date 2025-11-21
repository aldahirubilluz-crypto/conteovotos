package validator

import "github.com/go-playground/validator/v10"

var Validate *validator.Validate

func InitValidator() error {
    Validate = validator.New()
    return nil
}
