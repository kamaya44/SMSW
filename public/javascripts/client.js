//Archivo de Control de la Aplicacion

//Cuando JqueryMobile se ha cargado
//Funciones de Inicio
$("#btnRegistrarUsuario").on('click',nu_user_onclick);
$("#login").on('pagecreate',login_onLoad);
$("#Principal").on('pagebeforeshow',Principal_show);
$("#itemCreate").on('pagebeforeshow',ni_creation)

//variables

var LoggedIn=false;
function ni_creation(e){
  if(LoggedIn==true)
  {   //verificamo si estamos logeado para realizar est aaccion
    $("#Evento-send").on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      var formObject = {};
      formObject.Evento=$("#Evento-txtNombre").val();
      formObject.estado=$("#Evento-cmbEstado").val();
      formObject.fecha=$("#Evento-Fecha").val();
      formObject.hora=$("#Evento-Hora").val();
      formObject.Locacion=$("#Evento-Lugar").val();
      console.log(formObject);
      guardarNuevoItem(formObject,function(err,data){
        if(err){
          return console.log("Error al guardar el nuevo item");
        }
      });


    }); //end Click createITem
  }
  else{
   alert("no puedes acceder");
   $(location).attr('href','#login');
  }
  $("#btnCerrar").on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      logAdmin=false;
      //var form_body;
     changeTo("login");
     $.get("/api/logout");

  });
}//creacion de nuevo item de Evento




function Principal_show(e)
{
  $("#btnCerrar").on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      logAdmin=false;
      //var form_body;
     changeTo("login");
     $.get("/api/logout");

  }); //btnCerrar
}//carga de Pagina Principal de Administrador

function login_onLoad(e)
{
  $("#btnIniciarSesion").on('click',function nl_user_onclick(e)
  {
    e.preventDefault();
    e.stopPropagation();
    var Password=$("#Password").val();
    var Email=$("#Email").val();


    var form_body={
                    "Email":Email,
                    "Password":Password
                  };

                  Login(form_body,function(err,data)
                  {
                    if(err)
                      {
                      return console.log("Error al Iniciar Session");
                     }
                });

  });
}



function nu_user_onclick(e){//funcion de Click en el boton de registrar
e.preventDefault();
e.stopPropagation();

var NombreCompleto=$("#NombreCompleto").val();
var Password=$("#Password").val();
var Email=$("#Email").val();


var form_body={

                "Email":Email,
                "Password":Password,
                "NombreCompleto":NombreCompleto

};
guardarNuevoContacto(form_body,function(err,data){
  if(err){
    return console.log("Error al guardar el nuevo usuario");
  }
  $("#Email").val("");
  $("#Password").val("");
  $("#NombreCompleto").val("");

});
}//nu_user_onclick




//Ajax events
//Configurar Ajax
var settings = {
  "async": true,
  "crossDomain": true,
  "dataType":"json",
  "headers": {
    "cache-control": "no-cache"
  }
}

$.ajaxSetup(settings);


function guardarNuevoContacto(form_data, despues){
  $.ajax(
    {
      "url":"api/nuevoUsuario",
      "method":"post",
      "data":form_data,
      "success": function(data, txtSuccess, xhrq){
                      despues(null, data);
                  },
      "error": function(xhrq, errTxt, data){
                      despues(true, null);
                  }
    }
  );
};


/*function logout(){
  $.ajax(
    {
      "url":"api/logout",
      "method":"get",
      "headers": {
        "cache-control": "no-cache"
      },
      "success": function(xhrq)
      {


                  },
      "error": function(xhrq){
                  }
    }
  );
};*/
function guardarNuevoItem(formObject, despues){
  $.ajax(
    {
      "url":"api/createitem",
      "method":"post",
      "data":formObject,
      "success": function(data, txtSuccess, xhrq){
                      despues(null, data);
                  },
      "error": function(xhrq, errTxt, data){
                      despues(true, null);
                  }
    }
  );
};


function Login(form_data, despues){
  $.ajax(
    {
      "url":"api/login",
      "method":"post",
      "data":form_data,
      "success": function(user,scsTxt,xhrq){
       if (user){
          LoggedIn=true;
           var nombreUsuario=user['Nombre'];
           var tipoUsuario=user['TipoUsuario'];
           $(location).attr('href','#Principal');
       }
     },
      "error": function(xhrq, errTxt, data){
                      despues(true, null);
                  }
    }
  );
};


//utilities
function changeTo(to){
  $(":mobile-pagecontainer").pagecontainer("change","#" + to);
}
