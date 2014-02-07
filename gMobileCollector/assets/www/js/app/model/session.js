gMobile.Models.Session = Backbone.Model.extend({
	defaults: function() {
	      return {
	    	  key:"",	//key bằng maBanDo_lopDuLieu_maDoiTuong
	    	  mabando: "",
	    	  lopdulieu:"",
	    	  data:"",
	    	  media:""
	      };
	  }
})

gMobile.Collections.Sessions = Backbone.Collection.extend({
    model: gMobile.Models.Session,
    
    initialize: function(_mabando){
    	if(_mabando != undefined)
    		this.localStorage = new Backbone.LocalStorage(_mabando);
    },
    
	fetch: function(options) {
            return Backbone.Collection.prototype.fetch.call(this, options);
    },
    
    getAllLopDuLieu: function(tenLop){
    	var me = this;
    	//Return 1 mảng các giá trị phù hợp
    	return me.where({
    		lopdulieu:tenLop
    	});
    },
    
    getAllDoiTuongCuaBanDo: function(maBanDo){
    	var me = this;
    	//Return 1 mảng model các phần tử được thêm trong 1 phiên
    	return me.where({
    		mabando: maBanDo
    	});
    },
    
    removeAll: function(){
    	var me = this;
    	for ( var int = 0; int < me.models.length; int++) {
			var model = me.models[int];
			model.destroy();
		}
    	me.fetch();
    },
    
    addObject: function(key, data, media){
    	var me = this;
    	var maBanDo = key.split("|")[0];
    	var lopDuLieu = key.split("|")[1];
    	//var a = new gMobile.Models.Session({key:key, mabando:maBanDo, lopdulieu:lopDuLieu, data:data});
    	//me.add(a);
    	me.create({key:key, mabando:maBanDo, lopdulieu:lopDuLieu, data:data, media:media});
    },
    
    checkExitsObject: function(key){
    	var me = this;
    	var result = null;
    	var model =  me.findWhere({
    		key:key
    	});
    	if(model != undefined)
    		return true;
    	else return false;
    },
    
    getObjectByKey: function(key){
    	var me = this;
    	var result = null;
    	var model =  me.findWhere({
    		key:key
    	});
    	
    	if(model != undefined)
    		return model.attributes;
    	else return null;
    },
    
    deleteObjectByKey: function(key){
    	var me = this;
    	var model =  me.findWhere({
    		key:key
    	});
    	model.destroy();
    },
    
    renderListSession: function(){
    	var me = this;
    	var html = "";
    	map.layerSession.removeAllFeatures();
    	//try {
    		if(me.models.length > 0){
        		for ( var int = 0; int < me.models.length; int++) {
    				var session_item =  me.models[int];
    				var attr_item = session_item.attributes;
    				var data_doituong = attr_item.data;
    				var xdaidien = getObjectInArray(data_doituong,"xDaiDien").value;
    				var ydaidien =  getObjectInArray(data_doituong,"yDaiDien").value;
    				//var tendoituong = getObjectInArray(data_doituong,"tenDoiTuong").value;
    				var tendoituong = "";
    				try {
    					tendoituong = getObjectInArray(data_doituong,"tenDoiTuong").value;	
					} catch (e) {
						// TODO: handle exception
					}
    				
    				var key = attr_item.key;	//Mã bản đồ | tên lớp dữ liệu | mã đối tượng
    				html += '<li>';
    				html += '<a href="#"><h2>'+tendoituong+'</h2></a>';
    				html += '<div class="split-custom-wrapper">';
    				html += '<a href="#" onclick="fnXoaDoiTuongSession('+ "'" + key + "'" +');" data-role="button" class="split-custom-button" data-icon="delete" data-rel="dialog" data-theme="c" data-iconpos="notext">Xóa</a>';
    				html += '<a href="#" onclick="fnSuaDoiTuongSession('+ "'" + key + "'" +');" data-role="button" class="split-custom-button" data-icon="gear" data-rel="dialog" data-theme="c" data-iconpos="notext">Sửa</a>';
    				html += '</div>';
    				html += '</li>';
    			}
        	}
		/*} catch (e) {
			// TODO: handle exception
		}*/
    	
    	$("#listviewSession").html(html);
    	$("#listviewSession").trigger("create");
    	$("#listviewSession").listview("refresh");
    },
    
    getABC: function(){
    	alert(1);
    }
});

var ListSession = new gMobile.Collections.Sessions; 


/*--------------Action session-------------*/
function fnXoaDoiTuongSession(key){
	if(confirm("Bạn có muốn xóa đối tượng này?")){
		var mabando = key.split("|")[0];
		var lopdoituong = key.split("|")[1];
		var madoituong = key.split("|")[2];
		var url = CurrentServer.serverurl + "/gservices/rest/geodatas/" + CurrentServer.dataid + "/" + lopdoituong +"/" + madoituong;
		$.ajax({
	         type: 'DELETE',
	         url: url,
	         contentType: "application/json; charset=utf-8",
	         success: function (dataResponse) {
	        	 if(dataResponse.code == 1){
        			var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
        			_listSession.fetch();
	        		 var modelDelete = _listSession.findWhere({key:key});
	        		// _listSession.remove(modelDelete);
	        		 modelDelete.destroy();
	        		 navigator.notification.alert(
	     		            'Xóa thành công đối tượng',				// message
	     		            function(){},         					// callback
	     		            'Thông báo',           					// title
	     		            'Ok'                  					// buttonName
	        		 );
	        		 _listSession.renderListSession();
	        	 }
	        	 else alert('Xóa thất bại');
	         },
	         error: function () {
	        	 alert('Xóa thất bại');
	         },
	         complete: function () {
	         }
		});
	}
}


function fnSuaDoiTuongSession(key){	
	keyEdit = key;
	fn_change_Page('mapPage');
	fnActiveView('list');
	var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
	_listSession.fetch();
	$('#btnEddEdit').find('.ui-btn-text').text("Cập nhật");	
	var data_session = _listSession.getObjectByKey(key);	//Data danh sách các trường của đối tượng
	var lopdulieu = data_session.lopdulieu;
	var mabando = data_session.mabando;
	var madoituong = key.split("|")[2];
	var data = data_session.data;
	var html = '<ul data-role="listview" data-inset="true" class="formInside">';
	
	for ( var int = 0; int < data.length; int++) {
		if(data[int].key != "xDaiDien" && data[int].key != "yDaiDien" && data[int].key != "geom"){
			html += " <li data-icon=\"custom\">";
			html += "    <div class=\"formValue\">";
			html += "      <label for=\"name2\">"+ data[int].key +"<\/label>";
			html += "       <input type=\"text\"  name='"+data[int].key+"' value='"+data[int].value+"' data-clear-btn=\"true\">";
			html += "    <\/div>";
			html += "<\/li>";
		}
	}
	
	html += '</ul>';
	$("#divThongTinchung").html(html);
	$("#divThongTinchung").trigger("create");

	
	var xDaiDien = getObjectInArray(data_session.data,"xDaiDien").value;
	var yDaiDien = getObjectInArray(data_session.data,"yDaiDien").value;
	map.setPointActive(xDaiDien, yDaiDien);
	map.map.setCenter(new OpenLayers.LonLat(xDaiDien, yDaiDien).transform(EPSG_4326, EPSG_900913));
	map.map.zoomTo(16);
	
	fnLoadDataEdit(key);
}