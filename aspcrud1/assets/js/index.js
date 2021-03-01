$(function () {

	loadData();

});

var error = "Ocurrió un error insesperado en el sitio, por favor intentelo mas tarde o pongase en contacto con su administrador.";
var success = "La accion se ralizó con exito";
var datosIncorrectos = "Datos incorrectos, vuelve a intentarlo.";

function loadData() {

	var filtro = $('#select_status').val();

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonas',
		type: 'POST',
		data: { Filtro: filtro },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();
		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function (data) {
			//console.log(data);
			LoadingOff();

			if (data != "") {

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].id + `)" title="Eliminar" type="">
							<i class="fa fa-trash" aria-hidden="true"></i>
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].id + `)"  title="Ver Detalles" type="">Ver detalles
               	    	</button></tr>`;
					}

				}

				$('#tbody').html(TablaPersonas);
			}
			else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});

}

function detalles(id) {
	$.ajax({
		url: SITE_URL + '/Home/DetallesPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function (data) {
			//console.log(data);
			LoadingOff();

			if (data != "") {

				$("#Nombre").val(data[0].Nombre);
				$("#ApellidoP").val(data[0].ApellidoP);
				$("#ApellidoM").val(data[0].ApellidoM);
				$("#Direccion").val(data[0].Direccion);
				$("#Telefono").val(data[0].Telefono);

				$('#addUser').addClass('is-active');

			}
		}

	});
}
function reactivar(id) {
	$.ajax({
		url: SITE_URL + "/Home/ReactivarPersona/",
		type: "POST",
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {
			if (data) {
				LoadingOff();

				loadData();
			} else {
				Error.Log("Error!", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			//Error.Log(error.responseText, "Error, por favor revisa la conexión e inténtalo de nuevo");		
			LoadingOff();
		}
	});
}
function prepararInfo(id) {
	let info = {};
	info.Nombre = $('#Nombre').val();
	info.ApellidoP = $('#ApellidoP').val();
	info.ApellidoM = $('#ApellidoM').val();
	info.Direccion = $('#Direccion').val();
	info.Telefono = $('#Telefono').val();

	procede = validarFormulario(info);

	if (procede) {
		if (edit) {
			info.Id = id;
			guardarEdicion(info);
		} else {
			guardar(info);
		}

	} else {
		MsgAlerta("Atención!", "Faltan campos por llenar!", 3000, "danger");
	}
} 

function guardar(info) {
	$.ajax({
		type: "POST",
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + "/Home/CrearClientes",
		data: info,
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {
			if (data) {
				LoadingOff();

				MsgAlerta("Listo!", "Persona guardada", 3000, "success");

				loadData();
				limpiarInput();
				$('#exampleModal').modal('hide');
			} else {
				//ErrorLog("Error!", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			//Error.Log(error.responseText, "Error, por favor revisa la conexión e inténtalo de nuevo");
			console.log("No")
		}
	});
}

function eliminar(id) {
	$.ajax({
		url: SITE_URL + "/Home/EliminarPersona/",
		type: "POST",
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {
			if (data) {
				LoadingOff();

				loadData();
			} else {
				Error.Log("Error!", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			//Error.Log(error.responseText, "Error, por favor revisa la conexión e inténtalo de nuevo");		
			LoadingOff();
		}
	});		
}

function editar(id) {
	edit = true;
	detalles(id);

	sendButton = document.getElementById("guarda");
	sendButton.setAttribute('onclick', 'prepararInfo(' + id + ');');
}

$(document).on('change', '#select_status', function (e) {
	loadData();
});


$(document).on('keyup', '#txt_busqueda', function (e) {

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonasbusqueda',
		type: 'POST',
		async: false,
		data: { Busqueda: $(this).val() },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();

		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 5000, "error");
			LoadingOff();
		},
		success: function (data) {
			console.log(data);
			LoadingOff();

			if (data != "") {

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].id + `)" title="Eliminar" type="">Eliminar
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].id + `)"  title="Ver Detalles" type="">Ver detalles
               	    	</button></tr>`;
					}

				}

				$('#tbody').html(TablaPersonas);
			}
			else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
});

// validaOnlyNumbers('txt_busqueda');