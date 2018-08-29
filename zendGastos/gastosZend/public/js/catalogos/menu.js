var Menu = {
	nameMenuCtrl : "",
	init : function() {
		var menuCtrl ="";
		$('ul#catalogo-menu li a').each(function() {
			var module 		= $(this).attr('rel-module');
			var controller 	= $(this).attr('rel-controller');
			var action 		= $(this).attr('rel-action');
			var url 		= $(this).attr('href');


			//console.log('Name Menu: ' + menuCtrl);

			$(this).click(function(e) {
				e.preventDefault();
				if( module && controller && action){
					console.log(module + '-' + controller + '-' + action);
					Menu.loadModuleMenu(module, controller, action, url);

				}else if(url !="#"){
					Menu.loadModuleMenu(module, controller, action, url);
					console.log(url);
				}
			});
		});


		/*
		 $("#catalogo-content").mouseleave(function(){
		 //var baseUrl = this.baseUrl2 = '/gastosfact/public';
		 if( $("p#useridpm").length > 0) {
		 var baseUrl = baseUrl = '/gastosfact/public';
		 $("p#useridpm").attr('id','userid');
		 $("span#userid").attr('id','useridctrl');
		 }
		 })

		 $("#catalogo-content").mouseenter(function(){
		 if($("span#userid").length > 0 || $("span#useridctrl").length > 0) {
		 //var baseUrl = this.baseUrl2 = '/ctrlActivos/public';
		 //console.log('enter' + this.baseUrl2);
		 $("p#userid").attr('id','useridpm');
		 $("span#useridctrl").attr('id','userid');
		 }
		 });
		 */
		//alert("Hola Mike como estas?");
	},

	loadModuleMenu : function(module, controller, action, url) {
		$('#catalogo-content').html('');
		var userid = $('#userid').html();
		var cvetra = $('#cvtraEmpleado').html();
		var urlCarga = "";
		if(url == "#"){
			urlCarga = baseUrl + '/' + module + '/' + controller + '/' + action+ '/';
		} else if(action == 'ctrlactivos' && url != "#") {
			urlCarga = url + "/userid/"+userid;
			var iframeCtrl = "<iframe src='" + url + "/userid/" + userid + "'" + " "  + "height='470'"  + " " + "width='100%'" + "name='iframe_a'" + " " + "frameborder='0'></iframe>";
			$(".grid-title").html('');

		} else {
			// urlCarga = url + "&usr="+userid;
		}
        loadingActions.enableLoading('#pendulum-loader');
		$.ajax({
			url: urlCarga,
			type: 'POST',
			data: {test: 'test', userid: userid, cvetra:cvetra},
			dataType: 'html',
			complete: function() {
				//Modal.close();
			},
			success: function(data) {
				if(action == 'ctrlactivos' && url != "#") {
					$('#catalogo-content').append(data);
					// $('#catalogo-content').append(iframeCtrl);

				} else {
					$('#catalogo-content').html(data);
				}

                loadingActions.disableLoading('#pendulum-loader');
				//Gestion.resizeElements();
			}
		});
	},
	setNameMenuCtrActivos: function( name ){
		this.nameMenuCtrl = name;
	},

	getNameMenuCtrActivos: function(){
		return this.nameMenuCtrl;
	},



};

Menu.init();