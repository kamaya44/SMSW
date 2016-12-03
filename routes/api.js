var express= require('express');
var router= express.Router();
var assign= require('object-assign');
var ObjectID=require('mongodb').ObjectID;

function encriptar(username,Password) {
   var crypto = require('crypto')
   var hmac = crypto.createHmac('sha1', username).update(Password).digest('hex')
   return hmac;
}//encriptar
function apiFactory(db)
{
  //Collections of Data MongoDB
  var usuariosColl=db.collection('Usuarios');
  var Eventos = db.collection('Eventos');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Form Validation', success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  });

router.post('/nuevoUsuario', function(req,res,next)
{

     var newUsuario = assign({
             Email:"",
             Password:"",
             NombreCompleto:""
    })
   var Password=req.body.Password;
   var username=req.body.Email;

   var crypt=encriptar(username,Password);
   newUsuario.Email= username;
   newUsuario.NombreCompleto=req.body.NombreCompleto;
   newUsuario.Password=crypt;
   usuariosColl.findOne({"Email":username},function(err,user){
     if(!user){
       usuariosColl.insertOne(newUsuario, function(err,result){
     if (err) {
       res.status(500).json({"error":"No se pudo insertar el usuario"});
     } else {
       res.status(200).json("inserted");
     }
    })
  } // si no existe
  else{
    res.status(200).json('Existe');
  }
   })

     });//Router Post nuevo Usuario

     router.post('/login', function(req,res,next)
     {

          var newUsuario = assign({
                  Password:"",
                  Email:""
         })
        var Password=req.body.Password;
        var username=req.body.Email;
        var crypt=encriptar(username,Password);

        newUsuario.Email= username;
        newUsuario.Password=crypt;
        usuariosColl.findOne({"Email":username},function(err,user){
          if (err) {
            return res.status(500).send();
          }
          if(!user){
            return res.status(404).json('No existe');
          }
          req.session.user=user;
          return  res.status(200).json(user);
        })
          });//Router Post nuevo Usuario


    router.get('/usuarios',function(req,res,next){//RouterGetUsuario
    usuariosColl.find({}).toArray(function(err,usuarios){
     if(err)
     {
       return res.status(400).json([]);
     }
     res.status(200).json(usuarios);
   });
  })




router.get('/usuario/:id',function(req,res,next){
  var id= ObjectID(req.params.id);
  usuariosColl.findOne({"_id":id},function(err,usuario){
  if(err){
    console.log(err);
    return res.status(400).json({"error":"error al cargar la persona"});
  }
  res.status(200).json(usuario);
  })
});

router.put('/usuario/:id', function(req,res,next){
    var id = ObjectID(req.params.id);
    var updateRole = assign({},
                                {"Administrador":"",
                                "Operador":""},
                                req.body
                              );
      var updateExpression = {"$push":
                                {"Rol":updateRole},
                              "$inc":
                                {"numRoles":1}
                              };
      usuariosColl.update({"_id":id},updateExpression, function(err,rlt){
          if(err){
            console.log(err);
            return res.status(400).json({"error":"No se pudo actualizar persona"});
          }
          //console.log(rlt.result);
          if(rlt.result.nModified){
              res.status(200).json({"status":"ok"});
          }else{
            res.status(400).json({"error":"No se modificó la persona seleccionada"});
          }

      });
});//Actualizar Usuario

router.post('/createitem', function(req,res,next){
    
        var newEvent = assign({
                      Evento:"",
                       estado:"",
                       fecha :"",
                       hora  : "",
                       Locacion: ""
            })
            var Evento=req.body.Evento;
            var fecha=req.body.fecha;
            var hora=req.body.hora;
            var Locacion=req.body.Locacion;
            newEvent.Evento=Evento;
            newEvent.fecha=fecha;
            newEvent.hora=hora;
            newEvent.Locacion=Locacion;
            Eventos.insertOne(newEvent, function(err,result){
             if (err) {
                 res.status(500).json({"error":"No se pudo insertar el evento"});
                      }
            else {
                res.status(200).json({"inserted":"Evento Registrado"});
                 }
            })//Insert One Event


  });//end createitem


router.get('/logout', function(req, res){
       req.session.destroy();
       res.status(200).json({"ok":true});
   });//CerrarSession




  return router;
}
module.exports=apiFactory;
