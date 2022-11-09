class Error {
    code = 0;
    message = "";
    isFail = false;
    isOk = true;
    data = {};
}
module.exports.NewOK = function (data = {}) {
    error = new Error()
    error.code = 0
    error.message = ""
    error.data = data
    error.isFail = false
    error.isOk = true
    return error
}
module.exports.NewError = function (message, data = {}) {
    error = new Error()
    error.code = 1
    error.message = message
    error.data = data
    error.isFail = true
    error.isOk = false
    return error
}