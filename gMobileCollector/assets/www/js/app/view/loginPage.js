var LoginPage;
$(function(){	
	LoginPage = Backbone.View.extend({
		//Bắt sự kiện trong trang loginPage
	    el: $("#mainPage"),
	    //Đăng ký các sự kiện trên trang main
	    events: {
	      "click #logInButton"		:  "userLogIn"
	    },
	    initialize: function() {
	    
	    },	    
	    userLogIn: function(){
	    	if(ListServer.findWhere({done:true}) == undefined){
				navigator.notification.alert(
		            'Cần chọn server trước', 				// message
		            function(){},         					// callback
		            'Thông báo',           					// title
		            'Ok'                  					// buttonName
		        );
				return;
	    	}
	    	CurrentServer = ListServer.findWhere({done:true}).attributes;
			showLoader("Đang đăng nhập...");
			var url = CurrentServer.serverurl + "/gServices/rest/authentication/login";
			var user = $("#username").val();
			var pass = $("#password").val();
			var data ={"username":user,"password":pass};
			$.ajax({
				type: 'POST',
	            url:url,
	            data: JSON.stringify(data),
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            success: function (responseData, textStatus, jqXHR) {
	            	if(responseData.loginResult.code == 1){
	            		apikey = responseData.loginResult.message;
	            		try {
	            		    var lsCatalog = new ExplorerPageListCatalog;
	            		    var lsResource = new ExplorerPageListItems;
						} catch (e) {
							// TODO: handle exception
							e;
						}
	            		
	            		//active explorer
	            		$.mobile.changePage("#explorerPage" ,{transition : "slide"});
	            	}else {
	        			//alert('Đăng nhập thất bại');
	            		navigator.notification.alert(
	            	            'Đăng nhập thất bại', 				// message
	            	            function(){},         					// callback
	            	            'Thông báo',           					// title
	            	            'Ok'                  					// buttonName
	            	        );
	        			//STORAGE.setItem("apikey", null);
	            	}
	            	hideLoader();
	            	
	            },
	            error:function( jqXHR, textStatus, errorThrown){
	            },
	            complate:function(){
	            		
	           }
			});
		}
		
	  });
});

