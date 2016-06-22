var express   =   require( 'express' );
//dependencias proyecto principal
var path = require('path');
var logger = require('morgan');
var ingenieros = require('./bower_components/ingenieros.json');
var convenios = require('./bower_components/convenios.json');
//dependencias subir archivos
var multer    =   require( 'multer' );
var upload    =   multer( { dest: 'uploads/' } );
var sizeOf    =   require( 'image-size' );
var exphbs    =   require( 'express-handlebars' );
require( 'string.prototype.startswith' );

var app = express();

app.use(logger('dev'));

app.use( express.static( __dirname + '/bower_components' ) );

//app.engine( '.hbs', exphbs( { extname: '.hbs' } ) );
//app.set('view engine', '.hbs');
app.get('/api/ingenieros', function (req, res) {
  var type = req.query.type;

  if (type) {
    var results = ingenieros.filter(function (ingeniero) {
      return ingeniero.type.some(function (t) {
        return t.toLowerCase() === type;
      });
    });

    res.send(results);
  } else {
    res.send(ingenieros);
  }
});

app.get('/api/convenios', function (req, res) {
  var type = req.query.type;

  if (type) {
    var results = convenios.filter(function (convenio) {
      return convenio.type.some(function (t) {
        return t.toLowerCase() === type;
      });
    });

    res.send(results);
  } else {
    res.send(convenios);
  }
});

app.get('/api/convenios/:name', function (req, res) {
  var name = req.params.name;
  var results = convenios.filter(function (convenio) {
    return convenio.name.toLowerCase() === name;
  });

  if (results.length > 0) {
    res.send(results[0]);
  } else {
    res.status(404).end();
  }
});

app.get('/api/ingenieros/:name', function (req, res) {
  var name = req.params.name;
  var results = ingenieros.filter(function (ingeniero) {
    return ingeniero.name.toLowerCase() === name;
  });

  if (results.length > 0) {
    res.send(results[0]);
  } else {
    res.status(404).end();
  }
});

app.get( '/', function( req, res, next ){
  return res.render( 'index' );
});

app.get( '/home', function( req, res, next ){
  return res.render( 'index.html' );
});

app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
  console.log(req.file.mimetype);
  if ( !req.file.mimetype.startsWith( 'image/' ) && !req.file.mimetype.startsWith( 'application/' )){
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } );
  }

 // var dimensions = sizeOf( req.file.path );

  /*if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    return res.status( 422 ).json( {
      error : 'The image must be at least 640 x 480px'
    } );
  }*/

  return res.status( 200 ).send( req.file );
});

app.listen( 8080, function() {
  console.log( 'Express server listening on port 8080' );
});
