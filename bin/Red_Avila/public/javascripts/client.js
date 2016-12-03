//Archivo de Control de la Aplicacion

//Cuando JqueryMobile se ha cargado
  //Funciones de Inicio
$("#btnRegistrarUsuario").on('click',nu_user_onclick);


function nu_user_onclick(e){
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

//utilities
function changeTo(to){
  $(":mobile-pagecontainer").pagecontainer("change","#" + to);
}
