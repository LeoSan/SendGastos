/** File:           externos-getUserUpdate.js
 *  Date Creation:  19-Dic-2015 11:10 a.m.
 *  
 *  Module:         catalogos
 *  Controller:     Externos
 *  Action:         getUserUpdate
 *  View:           get-user-update.phtml
 *  
 */

$(function(){

	var externosUpdate = {
		init : function() {
			$("h4.grid-title").text(titulo);

			$('#btnUpdateAbo').off('click').on('click', function(e){
				e.preventDefault();
				
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: 'http://quantum2.pendulum.com.mx/gastos/createUsersPM.php?bd=workflow',
			        success: function (data) {
				        
			        	console.log(data);
			        	
			        	$(".dataSpace").html(data);
			        	
			        	return false;
			        }
			    });

			});
			
			$('#btnUpdatePro').off('click').on('click', function(e){
				e.preventDefault();
				
				alert("OK2");
			});
			
			$('#btnShowAbo').off('click').on('click', function(e){
				e.preventDefault();
				
				$.ajax({
			        type: "POST",
			        dataType: 'html',
			        url: baseUrl + '/catalogos/externos/get-abogados-ext',
			        success: function (data) {
				        
			        	console.log(data);
			        	
			        	
			        	return false;
			        }
				});
			});

		}
	}

	externosUpdate.init();

});