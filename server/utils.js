const http = require('http')
const fs = require('fs')

module.exports = {
  download: function(url, filepath, cb) {
    const file = fs.createWriteStream(filepath)
    http.get(url, function(response) {
      response.pipe(file)
      file.on('finish', function() {
        file.close(cb)
      })
    }).on('error', function(err) { // Handle errors
      fs.unlink(filepath)
      if (cb) cb(err.message)
    })
  },
  jsonResponse: function(res, data, error, success=true, code=200) {
    return res.status(code).json({
      data,
      success,
      error,
    })
  },
}
