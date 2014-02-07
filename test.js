var should = require('chai').should();

var ts = require('./');
var es = require('event-stream');
describe('stream of tiles', function() {
  var num = 0;
  it('should works', function(done){
    var stream = new ts(6, 11, [ -77.1408, 38.779, -76.893, 39.0088 ]);
    var through = es.mapSync(function(data){
      num++;
    });
    through.on('end', function(){
      num.should.equal(16);
      done();
    });
    stream.pipe(through);
  });
});