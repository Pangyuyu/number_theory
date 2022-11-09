const path = require('path');
module.exports.LsMac = function () {
    this.GetServerPath = function () {
        return path.resolve(".", "res", "server", "kt-820li-local-server")
    }
}