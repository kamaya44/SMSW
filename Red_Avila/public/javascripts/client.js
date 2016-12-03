//Archivo de Control de la Aplicacion

//Cuando JqueryMobile se ha cargado
  //Funciones de Inicio
$("#btnRegistrarUsuario").on('click',nu_user_onclick);
$("#btnIniciarSesion").on('click',nl_user_onclick);

function nl_user_onclick(e)
{//funcion de Click en el boton de login
  e.preventDefault();
  e.stopPropagation();
  var NombreCompleto=$("#NombreCompleto").val();
  var Password=$("#Password").val();
  var form_body={
                  "Password":Password,
                  "Email":Email
  };
  IniciarSesion(form_body,function(err,data){
    if(err){
      return console.log("Error al guardar el nuevo usuario");
    }
    $("#Email").val("");
    $("#Password").val("");
  });
}//funcion de Click en el boton de login

function nu_user_onclick(e){//funcion de Click en el boton de registrar
e.preventDefault();
e.stopPropagation();

var NombreCompleto=$("#NombreCompleto").val();
var Password=$("#Password").val();
var Email=$("#Email").val();


var form_body={
                "NombreCompleto":NombreCompleto,
                "Password":Password,
                "Email":Email
};
guardarNuevoContacto(form_body,function(err,data){
  if(err){
    return console.log("Error al guardar el nuevo usuario");
  }
  $("#NombreCompleto").val("");
  $("#Password").val("");
  $("#Email").val("");

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

function IniciarSesion(form_data, despues){
  $.ajax(
    {
      "url":"api/login",
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

//utilities
function changeTo(to){
  $(":mobile-pagecontainer").pagecontainer("change","#" + to);
}
