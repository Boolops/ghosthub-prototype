var express = require('express');
var app = express();

// run app
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname));
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
