const httpcheck = require('./httpchecker');

var check = new httpcheck('https://google.com', 'http');
check.http();