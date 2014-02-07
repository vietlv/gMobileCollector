var gMobile = gMobile || {}; 
var EPSG_900913 = new OpenLayers.Projection("EPSG:900913");
var EPSG_4326 = new OpenLayers.Projection("EPSG:4326");
var divMap = "map";
var featureOverlaySelect;
Class = function (methods) {
    var klass = function () {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }

    if (!klass.prototype.initialize) klass.prototype.initialize = function () { };

    return klass;
};

gMobile.Map = Class({
	map					:null,
	cauHinh				:null,
	chuDe				:null,
	khungNhinHienTai	:null,
	loaiBanDo			:null,
	maBanDo				:null,
	maUngDung			:null,
	mauNenMacDinh		:null,
	moTa				:null,
	mucXemLonNhat		:null,
	mucXemNhoNhat		:null,
	nguoiCapNhat		:null,
	nguoiTao			:null,
	tenBanDo			:null,
	tuKhoa				:null,
	vungBaoGioiHan		:null,
	vungBaoLonNhat		:null,
	vungBaoNhoNhat		:null,
	cacLopBanDo			:null,
	cacLopNen			:null,
	layerMarker			:null,
	layerLocation		:null,	//my location and i_am_here
	layerOverlay		:null,
	layerSession		:null,
	statusLegend		:false,
	popup				:null,
	layersCanvas		:null,
	currentLonlat		:null,	//4326
	statusIamhere		:false,
	controlClick		:null,	//Control cho i_am_here
	controlTouch		:null,
	controlSelect		:null,
	featureSelect		:null,
	searchResultMap		:null,
	cauHinhMoRong 		:null,
	danhSachDoiTuong	:null,
	layerActive			:null,
	controlDrag			:null,
	object				:null,
	
	/** 
    * APIMethod: constructor
    *
    * Parameters:
    * url - {<url> || string}
    * div - Thẻ div chứa bản đồ
    */
	initialize: function (objectmap, div, callback) {
		var me = this;
			
		var data = objectmap;
		//$("#imgIamhere").attr("src","img/iamhere_deactive.png");
		me.cauHinh = data;
		me.loaiBanDo = data.loaiBanDo;
		me.tenBanDo = data.tenBanDo;
		me.nguoiTao = data.nguoiTao;
		me.moTa = data.moTa;
		me.vungBaoGioiHan = data.vungBaoGioiHan;
		me.vungBaoLonNhat = data.vungBaoLonNhat;
		me.vungBaoNhoNhat = data.vungBaoNhoNhat;
		me.cacLopBanDo = data.cacLopBanDo;
		me.khungNhinHienTai = data.khungNhinHienTai;
		me.maBanDo = data.maBanDo;
		me.mucXemLonNhat = data.mucXemLonNhat;
		me.mucXemNhoNhat = data.mucXemNhoNhat;
		//me.cauHinhMoRong = data.cauHinhMoRong;
		
		me.cauHinhMoRong  = JSON.parse(data.cauHinhMoRong);
		me.controlTouch =  new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                enableKinetic: true
            }
        });
		
		$("#h3TenBanDo").html(me.tenBanDo);
		var stylesLocation = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                externalGraphic : "${externalGraphic}",
             
            	graphicWidth    : "${graphicWidth}",
            	graphicHeight   : "${graphicHeight}",
            	graphicYOffset  : "${graphicYOffset}",
            	//labelYOffset    : "${labelYOffset}",
            	//labelYOffset	: 50,
            	label		    : "${label}",
            	//graphicXOffset: "${graphicXOffset}",
            	opacity         : 1
            })
        });
		
		var styleLayerMarker = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
            	fillColor:"blue",
            	strokeColor:"red",
            	pointRadius: 10,
//	                	label		    : "${label}",
            	opacity         : 1
            })
        }); 
		
		var styleLayerOverlay = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
            	fillColor:"blue",
            	strokeColor:"blue",
            	pointRadius: 10,
            	opacity         : 1
            })
        }); 
	    
	    // create map
		if(me.map != null){
			me.map.destroy();
			me.map = null;
		}
		
		var layers = [];
		me.layersCanvas = [];
		me.cacLopNen = [];
		if(me.cacLopBanDo.length > 0){
		    var arrayResolutions = [
	                                  156543.03390625, 78271.516953125, 39135.7584765625,
	                                  19567.87923828125, 9783.939619140625, 4891.9698095703125,
	                                  2445.9849047851562, 1222.9924523925781, 611.4962261962891,
	                                  305.74811309814453, 152.87405654907226, 76.43702827453613,
	                                  38.218514137268066, 19.109257068634033, 9.554628534317017,
	                                  4.777314267158508, 2.388657133579254, 1.194328566789627,
	                                  0.5971642833948135, 0.2985821416974068, 0.1492910708487034, 0.0746455354243517, 0.03732276771217585
	                               ];
	        var arrayServerResolutions = [
	                                        156543.03390625, 78271.516953125, 39135.7584765625,
	                                        19567.87923828125, 9783.939619140625,
	                                        4891.9698095703125, 2445.9849047851562,
	                                        1222.9924523925781, 611.4962261962891,
	                                        305.74811309814453, 152.87405654907226,
	                                        76.43702827453613, 38.218514137268066,
	                                        19.109257068634033, 9.554628534317017,
	                                        4.777314267158508, 2.388657133579254,
	                                       1.194328566789627, 0.5971642833948135, 0.2985821416974068, 0.1492910708487034, 0.0746455354243517, 0.03732276771217585
	                                     ];
	       
	        var serverResolutions = [];
	        serverResolutions = arrayServerResolutions;
			//Lấy danh sách các bản đồ nền ra
	        var activeBase;
			for ( var int = 0; int < me.cacLopBanDo.length; int++) {
				var layerItem = me.cacLopBanDo[int];
				if(layerItem.kieuKhongGian.toUpperCase() == "IMAGE"){
					var minLevel = 0;
					var maxLevel = 22;
					try {
						minLevel = (layerItem.mucXemNhoNhat == null) ? 0 : layerItem.mucXemNhoNhat;
						maxLevel = (layerItem.mucXemLonNhat == null) ? 22 : layerItem.mucXemLonNhat;	
					} catch (e) {
					}
					var resolutions = [];
					var jj = 0;
				    for (var ii = minLevel; ii < maxLevel + 1; ii++) {
				            resolutions[jj] = arrayResolutions[ii];
				            jj++;
				    }
				   
					//Nếu đường dẫn có chứa http thì giữ nguyên
					//if(layerItem.duongDan.indexOf("http") !== -1){
				    
				    if(layerItem.duongDan.indexOf("http") == -1){
				    	layerItem.duongDan = getCurrentServer().serverurl + "/" +layerItem.duongDan;
					}else{
						
					}
					
					
					var layerBaseItem =   new OpenLayers.Layer.XYZ(
							layerItem.tenLopBanDo,
                		    [
                		       layerItem.duongDan
                		 
                		    ], {
                		        attribution: "&copy; <a href='http://cloudgis.vn/'>gServer</a>",
                		        sphericalMercator: true,
                		        wrapDateLine: true,
                		        visibility: layerItem.hienThi,
                		        isBaseLayer:true,
                		        resolutions:resolutions,
                		        serverResolutions: serverResolutions
                		    });
					
					
					layerBaseItem.hienThi = layerItem.hienThi;
					if(layerItem.hienThi == true){
						me.layerActive = layerBaseItem;
					}
					
					
					me.cacLopNen.push(layerBaseItem);
					layers.push(layerBaseItem);
				}else{
					//me.layersCanvas.push( me.cacLopBanDo[int]);
				}
						
			}
		}
		
		//Vùng bao lớn nhất
        var max_extent = null;
        if (me.vungBaoLonNhat != null && me.vungBaoLonNhat != "") {
            max_extent = new OpenLayers.Bounds(
            		me.vungBaoLonNhat.left, me.vungBaoLonNhat.bottom, me.vungBaoLonNhat.right, me.vungBaoLonNhat.top);
            max_extent.transform(EPSG_4326, EPSG_900913);
           
        }else {
        	max_extent = max_extent_vn.transform(EPSG_4326, EPSG_900913);
        	//me.map.setOptions({maxExtent: max_extent});
        }
        
		var lonlatCenter;
		var levelZoom = -1;
		if(me.khungNhinHienTai == null || me.khungNhinHienTai == ""){
			lonlatCenter = max_extent.getCenterLonLat();
			levelZoom = -1;
        }else{
        	lonlatCenter = new OpenLayers.LonLat(me.khungNhinHienTai.x, me.khungNhinHienTai.y).transform(EPSG_4326, EPSG_900913);
        	levelZoom = me.khungNhinHienTai.level;
        }
		
		me.map = new OpenLayers.Map({
	        div: div,
	        theme: null,
	        controls: [
	            new OpenLayers.Control.Attribution(),
				me.controlTouch//,
	          //  new OpenLayers.Control.Zoom()
	        ],
	        layers: layers,
	    	center: lonlatCenter,
	        zoom:levelZoom
	    });
		
		
		me.map.setBaseLayer(activeBase);
		

		var restricted_Extent = null;
        //Vùng bao giới hạn
        if (me.vungBaoGioiHan != null && me.vungBaoGioiHan != "") {
            restricted_Extent = new OpenLayers.Bounds(
            		me.vungBaoGioiHan.left, me.vungBaoGioiHan.bottom, me.vungBaoGioiHan.right, me.vungBaoGioiHan.top);
            restricted_Extent.transform(EPSG_4326, EPSG_900913);
            me.map.setOptions({restrictedExtent: restricted_Extent});
        }
        
        //Set vùng bao lớn nhất 
        me.map.setOptions({maxExtent: max_extent});
        if(levelZoom == -1) me.map.zoomToMaxExtent();
       	me.styleMarker = data.styleMarker;
       	if(me.styleMarker == null)
       		me.layerMarker = new OpenLayers.Layer.Vector("layerMarker", {styleMap:styleLayerMarker});
       	else me.layerMarker = new OpenLayers.Layer.Vector("layerMarker", {styleMap:me.styleMarker});
		me.layerOverlay = new OpenLayers.Layer.Vector("layerOverlay",{styleMap:styleLayerOverlay});
		me.layerLocation = new OpenLayers.Layer.Vector("layerLocation");
		me.layerSession = new OpenLayers.Layer.Vector("layerSession");
		me.layerSession.id = "layerSession";
		me.map.addLayer(me.layerMarker);
		me.map.addLayer(me.layerOverlay);
		me.map.addLayer(me.layerLocation);
		me.map.addLayer(me.layerSession);
		me.controlDrag = new OpenLayers.Control.DragFeature(me.layerOverlay);
		me.controlDrag.onComplete = function (feature) {
		  // alert('drag complete'  +feature.geometry.x);
		   var geo4526 = feature.geometry.clone().transform(EPSG_900913,EPSG_4326);
		   me.object.location = {
				   xdaidien:geo4526.x,
				   ydaidien:geo4526.y
		   }
		}
		me.map.addControl(me.controlDrag);
		me.controlDrag.activate();
		//Add control select
		me.controlSelect = new OpenLayers.Control.SelectFeature([me.layerOverlay,me.layerMarker, me.layerSession],
	             {onSelect: me.onFeatureSelect, onUnselect: me.onFeatureUnselect});
	    me.map.addControl(me.controlSelect);
	    

		me.map.events.register('touchstart', me.map, function(e) {
	         multiTouchEvent = e.touches.length;
	         timeoutId = setTimeout(function() {
	              if (multiTouchEvent > 1) {
	                   clearTimeout(timeoutId);
	              }
	              else {
	                   var lonlat = me.map.getLonLatFromPixel(e.xy);
	                   var lonlat4326 = lonlat.clone().transform(EPSG_900913,EPSG_4326);
	                   me.setPointActive(lonlat4326.lon, lonlat4326.lat);
	                   //Change text action & change action
	                   $('#btnEddEdit').find('.ui-btn-text').text("Hoàn tất");
	                   //Reload lại danh sách cấu hình
	                   fnLoadDanhSachLop(me);
	              }
	         }, waitFor);
	     }, true);
	
		me.map.events.register('touchmove', me.map, function(e) {
	         clearTimeout(timeoutId);
	    });
		
		me.map.events.register('touchend', me.map, function(e) {
	         clearTimeout(timeoutId);
	         //redraw
	    });
		
		me.renderBaselayer();
		callback(me.map);
    },
    
    setPointActive: function(xdaidien, ydaidien){
  	  	var me = this;
        var lonlat4326 = new OpenLayers.LonLat(xdaidien, ydaidien);
        var lonlat = lonlat4326.clone().transform(EPSG_4326, EPSG_900913);
        me.currentLonlat = lonlat4326;
        me.object.location = {xdaidien: xdaidien, ydaidien:ydaidien};
        var geoitem = new OpenLayers.Geometry.Point(me.object.location.xdaidien, me.object.location.ydaidien).transform(EPSG_4326, EPSG_900913);
	    	var feature = new OpenLayers.Feature.Vector(
	    			geoitem, null, {
	    				fillColor:"red",
	                	strokeColor:"blue",
	                	pointRadius: 10,
	                	opacity         : 1
	    			}
	            );
	    	feature.id = "detail";
	    	try {
	    		if(me.layerOverlay.getFeatureById("detail") != null)
	    	   	   me.layerOverlay.removeFeatures(me.map.layerOverlay.getFeatureById("detail"));	
			} catch (e) {
				// TODO: handle exception
			}
			me.layerOverlay.removeAllFeatures();
			me.layerOverlay.addFeatures(feature);
    },
    
    renderBaselayer: function(){
    	var me = this;
    	var htmlContent ="";
    	for ( var int = 0; int < me.cacLopNen.length; int++) {
    		var checked = "";
    		if(me.cacLopNen[int].hienThi == true){
    			checked = "checked";
    		}
    		htmlContent += '<input name="bglayer" id="layerBase_'+int+'" type="radio" value="'+int+'" '+checked+'>'
    					 +'<label for="layerBase_'+int+'">'+me.cacLopNen[int].name+'</label>';
		}
    	//me.cacLopNen
    	$("#divBaselayers").html(htmlContent);
    	$("#controlgroupBaselayer").controlgroup('refresh', true);
    	$("#divBaselayers").trigger("create");
    	$("input[name=bglayer]:radio").change(function () {
    		me.map.setBaseLayer(me.cacLopNen[this.value]);
    	});
    },
    onFeatureSelect: function(feature) {
    	var layerId = feature.layer.id;
    	//alert('1');
    	if(layerId == "layerSession"){
    		//alert('run');
    	}
    	
    	/*featureOverlaySelect = feature;
    	var tendoituong = feature.attributes.tendoituong;
    	$("#tenDoiTuongSelect").html(tendoituong);
    	$("#mapPopupInfo").popup("open");*/
    },
    
    unselect: function(){
    	
    },
   
    onFeatureUnselect: function(feature) {
    	featureOverlaySelect = null;
    },
    
    searchGeoName: function(){
    	var me = this;
    	var urlgeocode =  me.cauHinhMoRong.dichVuGeocode;
    	var q = $(".mapSearch").val();
    	showLoader('Đang tìm kiếm địa danh');
    	var url = CurrentServer.serverurl +  '/gservices/rest/geoname/'+ urlgeocode + "/search?q="+q+"&page=1&start=0&limit=20";
    	//var url = urlgeocode + "/search?q="+q+"&page=1&start=0&limit=20";
    	
    	$.ajax({
    		 type: 'GET',
             async: false,
             url: url,
             contentType: "application/json; charset=utf-8",
             dataType: 'jsonp',
             success: function (data) {
            	 hideLoader();
            	 me.layerMarker.removeAllFeatures();
            	 var SearchResult = data.SearchResult;
            	 var Total = data.Total;
            	 var html = "";
            	 for ( var int = 0; int < SearchResult.length; int++) {
            		 var dataitem = SearchResult[int];
					html += "<li><a onclick=\"fnMapSelectGeoName('"+dataitem.KinhDoWGS84+"','"+dataitem.ViDoWGS84+"');\">" + dataitem.Ten + " "+ dataitem.DiaChi + "</a></li>";
			
					var geoitem = new OpenLayers.Geometry.Point(dataitem.KinhDoWGS84,dataitem.ViDoWGS84).transform(EPSG_4326, EPSG_900913);
			    	var feature_geoname = new OpenLayers.Feature.Vector(
			    			geoitem, null,null
			            );
			    	feature_geoname.attributes.tendoituong = dataitem.Ten + " "+ dataitem.DiaChi;
			    	me.layerMarker.addFeatures(feature_geoname);
            	 }
            	 $("#mapDanhSachKetQua").html(html);
            	 $("#mapDanhSachKetQua").trigger("create");
            	 $("#mapDanhSachKetQua").listview("refresh");
            	 me.map.zoomToExtent(me.layerMarker.getDataExtent());
             },
             error:function(){
            	 hideLoader();
             }
    	
    	});
    	
    	//$("#panelRightMapViewer").panel("open");
    },
    startgpsWatch: function(){
    	var me = this;
    	var gpsOptions = {
    			enableHighAccuracy: true,
    			timeout: 5000,
    			maximumAge: 0
    		};

    	if(navigator.geolocation){
    		$('#gpsmessage').html('<div id="gpsmessagebox">Đang xem vị trí GPS...</div>');
    		gpswatch = navigator.geolocation.watchPosition(me.gpsokCallback, me.gpsfailCallback, gpsOptions);
    	}
    },
    
    stopgpsWatch: function(){
    	navigator.geolocation.clearWatch(gpswatch);
    	$('#gpsmessage').html("");
    },
        
    gpsokCallback: function(position){
    	var msg = '<div id="gpsmessagebox">' +
    	'Kinh độ: ' + position.coords.latitude + "<br>" +
    	'Vĩ độ: ' + position.coords.longitude + "<br>" +
    	'Độ chính xác: ' + Math.round(position.coords.accuracy) + " m<br>" +
    	'<a href="#" id="setGpspoint" data-role="button" data-icon="arrow-r" data-iconpos="right" data-inline="true"  data-mini="true" >Phóng tới vị trí</a></div>';
    	$('#gpsmessage').html(msg);
    	gpscoord = getTranspoint(position.coords.longitude,position.coords.latitude,4326,900913);
   	
    	var featureGPS = new OpenLayers.Feature.Vector(
    				  gpscoord, null,{
                      externalGraphic: "images/gps2.png",
                      graphicWidth: 48,
                      graphicHeight: 48,
                      graphicYOffset: -24,
                      fillOpacity: 1
                  }
        );
    	featureGPS.id = "mylocation";
    	
       if(map.layerLocation.getFeatureById("mylocation") != null)
    	   map.layerLocation.removeFeatures(map.layerLocation.getFeatureById("mylocation"));
    	map.layerLocation.addFeatures(featureGPS);

    	map.map.setCenter(new OpenLayers.LonLat(gpscoord.x, gpscoord.y));
		map.map.zoomTo(16);
		
    	$("#setGpspoint").bind( "click", function(event, ui) {
    		$("#nav-panel").panel( "close");

    		map.map.setCenter(new OpenLayers.LonLat(gpscoord.x, gpscoord.y));
    		map.map.zoomTo(14);
    	});
    	$("#setGpspoint").button();
    },

    addMarker: function(xdaidien, ydaidien){
    	
    },
    /* deacativeClick: function(){
    	var me = this;
      	var touchstart = function(e) {
	         multiTouchEvent = e.touches.length;
	         timeoutId = setTimeout(function() {
	              if (multiTouchEvent > 1) {
	                   clearTimeout(timeoutId);
	              }
	              else {
	                   var lonlat = me.map.getLonLatFromPixel(e.xy);
	                   var lonlat4326 = lonlat.clone().transform(EPSG_900913,EPSG_4326);
	                   me.setPointActive(lonlat4326.lon, lonlat4326.lat);
	              }
	         }, waitFor);
	    };
	    
	    var touchmove = function(e) {
	         clearTimeout(timeoutId);
		};
		
		var touchend = function(e) {
	         clearTimeout(timeoutId);
	    };
	    
    	var listeners_touchstart = me.map.events.listeners.touchstart.length;
    	var listeners_touchmove = me.map.events.listeners.touchmove.length;
    	var listeners_touchend = me.map.events.listeners.touchend.length;
		for	(var i = 0; i <listeners_touchstart; i++){
			me.map.events.un({
				"touchstart":touchstart
			});
		}
		for	(var i = 0; i <listeners_touchmove; i++){
			me.map.events.un({
				"touchmove": touchmove
			});
		}
		for	(var i = 0; i <listeners_touchend; i++){
			me.map.events.un({
				"touchend": touchend
			});
		}    	
    },
   activeClick: function(){
    	var me = this;
    	var touchstart = function(e) {
	         multiTouchEvent = e.touches.length;
	         timeoutId = setTimeout(function() {
	              if (multiTouchEvent > 1) {
	                   clearTimeout(timeoutId);
	              }
	              else {
	                   var lonlat = me.map.getLonLatFromPixel(e.xy);
	                   var lonlat4326 = lonlat.clone().transform(EPSG_900913,EPSG_4326);
	                   me.setPointActive(lonlat4326.lon, lonlat4326.lat);
	              }
	         }, waitFor);
	    };
	    
	    var touchmove = function(e) {
	         clearTimeout(timeoutId);
		};
		
		var touchend = function(e) {
	         clearTimeout(timeoutId);
	    };
	    
    	me.map.events.register('touchstart', me.map,touchstart , true);
	
		me.map.events.register('touchmove', me.map, touchmove);
		
		me.map.events.register('touchend', me.map, touchend);
    },
    */
    setObject:function(ob){
    	var me = this;
    	me.object = ob;
    	var flag = ob.flag;
    	//me.deacativeClick();
    	if(flag =="view"){
    		me.layerOverlay.removeAllFeatures();
    		me.layerMarker.removeAllFeatures();
    		me.controlSelect.deactivate();
    		me.controlDrag.deactivate();
    		var geoitem = new OpenLayers.Geometry.Point(me.object.location.xdaidien, me.object.location.ydaidien).transform(EPSG_4326, EPSG_900913);
	    	var feature = new OpenLayers.Feature.Vector(
	    			geoitem, null, {
	    				fillColor:"red",
	                	strokeColor:"blue",
	                	pointRadius: 10,
	                	opacity         : 1
	    			}
	            );
	    	feature.id = "detail";
	    	try {
	    		if(me.layerOverlay.getFeatureById("detail") != null)
	    	   	   me.layerOverlay.removeFeatures(me.map.layerOverlay.getFeatureById("detail"));	
			} catch (e) {
				// TODO: handle exception
			}
			
			me.layerOverlay.addFeatures(feature);
    		me.map.setCenter(new OpenLayers.LonLat(me.object.location.xdaidien, me.object.location.ydaidien).transform(EPSG_4326, EPSG_900913));
    		me.map.zoomToExtent(me.layerOverlay.getDataExtent());
    		me.map.updateSize();
    	}else if(flag == "edit"){
    		me.activeClick();
    		me.layerMarker.removeAllFeatures();
    		me.layerOverlay.removeAllFeatures();
    		var geoitem = new OpenLayers.Geometry.Point(me.object.location.xdaidien, me.object.location.ydaidien).transform(EPSG_4326, EPSG_900913);
	    	var feature = new OpenLayers.Feature.Vector(
	    			geoitem, null, {
	    				fillColor:"red",
	                	strokeColor:"blue",
	                	pointRadius: 10,
	                	opacity         : 1
	    			}
	            );
	    	feature.id = "detail";
	    	try {
	    		if(me.layerOverlay.getFeatureById("detail") != null)
	    	   	   me.layerOverlay.removeFeatures(me.map.layerLocation.getFeatureById("detail"));	
			} catch (e) {
				// TODO: handle exception
			}
	    	    
	    	me.layerOverlay.addFeatures(feature);
    		me.map.setCenter(new OpenLayers.LonLat(me.object.location.xdaidien, me.object.location.ydaidien).transform(EPSG_4326, EPSG_900913));
    		me.map.zoomToExtent(me.layerOverlay.getDataExtent());
    		me.controlSelect.deactivate();
    		me.controlDrag.activate();
    		me.map.updateSize();
    	}else if(flag == "new"){
    		//me.activeClick();
    		me.layerMarker.removeAllFeatures();
    		me.layerOverlay.removeAllFeatures();
    		try {
    			if(me.layerOverlay.getFeatureById("detail") != null)
    	 	       	 me.layerOverlay.removeFeatures(me.map.layerLocation.getFeatureById("detail"));
			} catch (e) {
				// TODO: handle exception
			}
    		me.controlSelect.deactivate();
    		me.controlDrag.activate();
    		me.map.updateSize();
    	}
    },
    CLASS_NAME: 'gMobile.Map'
});


function fnLoadMap(data){
	hideLoader();
	$.mobile.changePage("#mapPage");
	setmapsize();
	$("#map").empty();
	if(map != null && map.map != null)
		map.map.destroy();
	 map = new gMobile.Map(data, "map", function(mapob){
		 setTimeout(function() {
			mapob.updateSize();
			fnLoadDanhSachLop(map);
			map.setObject({
				location:null,
				data:null,
				flag:"new"
			});
			if(map.layerActive != null){
				mapob.setBaseLayer(map.layerActive);
			}
			$('#btnEddEdit').find('.ui-btn-text').text("Hoàn tất");
			fnCallbackInitmap();
	     }, 1000);
	});
}

function fnActiveControl(){
	map.controlDrag.deactivate();
	map.controlSelect.activate();
}

function fnCallbackInitmap(){
	map.layerSession.removeAllFeatures();
	if(ListSession.models.length > 0)
		for ( var int = 0; int < ListSession.models.length; int++) {
			var model_item = ListSession.models[int];
			var attributes_item = model_item.attributes;
			var data_doituong = attributes_item.data;
			
			var xdaidien = getObjectInArray(data_doituong,"xDaiDien").value;
			var ydaidien =  getObjectInArray(data_doituong,"yDaiDien").value;
			
		 	//var lonlat4326 = new OpenLayers.LonLat(xdaidien, ydaidien);
	        //var lonlat = lonlat4326.clone().transform(EPSG_4326, EPSG_900913);
	        var geoitem = new OpenLayers.Geometry.Point(xdaidien, ydaidien).transform(EPSG_4326, EPSG_900913);
		    var feature = new OpenLayers.Feature.Vector(geoitem);
		    feature.datasession = attributes_item;
		    map.layerSession.addFeatures(feature);
		}
}

function getTranspoint(x,y,i,o){
	var mypoint = new OpenLayers.Geometry.Point(x, y).transform(EPSG_4326,EPSG_900913); 
	return mypoint;
	//var lonlat = point.transform(EPSG_900913, EPSG_4326); 
}

function fnMapSelectGeoName(xdaidien, ydaidien){
	var geoitem = new OpenLayers.Geometry.Point(xdaidien,ydaidien).transform(EPSG_4326, EPSG_900913);
	map.map.setCenter(new OpenLayers.LonLat(geoitem.x,geoitem.y));
} 


/***
 * 	Action trên map
 *** /

/*-----------Load danh sách các lớp chuyên đề---------------------*/
function fnLoadDanhSachLop(_map){
	var first = 0;
	var cacLopBanDo = _map.cacLopBanDo;
	var html = " <select id='select_LopDoiTuong' onchange='fnOnchangeSelectDoiTuong(this)'>"
	for ( var int = 0; int < cacLopBanDo.length; int++) {
		var item = cacLopBanDo[int];
		if(item.kieuKhongGian != "IMAGE"){
			html += "<option value='"+item.lopDuLieu+"'>" +item.tenLopBanDo + "</option>";
			first ++;
			if(first == 1){
				fnRenderFormDynamic(cacLopBanDo[int]);
			}
		}
	}
	html += "</select>";
	$("#div_SelectLopDoiTuong").html(html);
	$('select').selectmenu();
}

/*---------------------Chọn 1 lớp đối tượng------------------*/
function fnOnchangeSelectDoiTuong(ob){
	for ( var int = 0; int < map.cacLopBanDo.length; int++) {
		if(map.cacLopBanDo[int].lopDuLieu == ob.value){
			fnRenderFormDynamic(map.cacLopBanDo[int]);
			break;
		}
	}
}

/*-----------------Render from động-------------------------*/
function fnRenderFormDynamic(_lopBanDo){
	listAttack = [];
	var cauHinhHienThi = _lopBanDo.cauHinhHienThi;
	var html = '<ul data-role="listview" data-inset="true" class="formInside">';
	for ( var int = 0; int < cauHinhHienThi.length; int++) {
		var cauHinhItem = cauHinhHienThi[int];
		if(cauHinhItem.viewtype == "fobject")
			listAttack.push(cauHinhItem);
		if(cauHinhItem.showmobile != 0 && cauHinhItem.viewtype != "dobject" && cauHinhItem.viewtype != "fobject"){
			html += " <li data-icon=\"custom\">";
			html += "    <div class=\"formValue\">";
			html += "      <label for=\"name2\">"+ cauHinhItem.alias +"<\/label>";
			html += "       <input type=\"text\"  name='"+cauHinhItem.name+"' value=\"\" data-clear-btn=\"true\">";
			html += "    <\/div>";
			html += "<\/li>";
		}
	}
	html += '</ul>';
	$("#divThongTinchung").html(html);
	$("#divThongTinchung").trigger("create");
}


/*--------------Create đối tượng---------------------*/
function onCreateObject(){
	if(checkConnection()){
		var lopdoituong = $("#select_LopDoiTuong").val();
		var url = CurrentServer.serverurl + "/gservices/rest/geodatas/" + CurrentServer.dataid + "/" + lopdoituong;
		var data = [];
		$("#divThongTinchung input").each(function() {
			var a =  $(this);
			data.push({
				"key": a.attr("name"),
				"value": a.val()
			});
		});
		
		if(map.object.location == null || map.object.location == undefined){
			navigator.notification.alert(
		            'Chưa xác định được vị trí', 				// message
		            function(){},         					// callback
		            'Thông báo',           					// title
		            'Ok'                  					// buttonName
		        );
			return;
		}
		
		var xdaidien = map.object.location.xdaidien;
		var ydaidien = map.object.location.ydaidien;
		data.push({
			"key":"xDaiDien","value":xdaidien
		});
		data.push({
			"key":"yDaiDien","value":ydaidien
		});
		data.push({
			"key":"geom",
			"value":"POINT("+ xdaidien + " " +ydaidien+")"
		});
	
		var data_goc = data;	//Data trước khi chuyển sang string
		data = JSON.stringify(data);
		showLoader("Đang thêm mới đối tượng");
		$.ajax({
	         type: 'POST',
	         url: url,
	         contentType: "application/json; charset=utf-8",
	         data: data,
	         success: function (dataResponse) {
	             if(dataResponse.code == 1){
	            	 hideLoader();
	            	 //fnOnSaveScreen(lopdoituong, dataResponse.message, data_goc);
	            	 fnOnSaveScreen(lopdoituong, dataResponse.message);
	            	 
	            	 //Add vào session
	            	 var htmlListImage = $('#listViewImageScreen').html();
	            	 //key = maBanDo|lopDuLieu|maDoiTuong
	            	 var keyObject = map.maBanDo + "|" + lopdoituong + "|" +dataResponse.message; 
	            	 //Khởi tạo 1 session theo mã bản đồ
	            	 var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
	            	 _listSession.fetch();
	            	 _listSession.addObject(keyObject,data_goc, htmlListImage);
	            		
	            		
	             }else{
	            	 alert('Thất bại' + dataResponse.code+ "__" + dataResponse.message);
	            	 hideLoader();
	             }
	         },
	         error: function(xhr, ajaxOptions, thrownError){
	        	 alert('Thất bại ' + thrownError);
	        	 hideLoader();
	         }
	    });
	}else {
		navigator.notification.alert(
	            'Không có kết nối mạng, vui lòng kiểm tra lại', // message
	            function(){},         							// callback
	            'Thông báo',           							// title
	            'Ok'                  							// buttonName
	        );
		return;
	}
}


function onEditObject(){
	var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
	_listSession.fetch();
	//$('#btnEddEdit').find('.ui-btn-text').text("Cập nhật");	
	var data_session = _listSession.getObjectByKey(keyEdit);	//Data danh sách các trường của đối tượng
	var model = _listSession.findWhere({key:keyEdit});
	
	//http://10.0.1.49:1113/gservices/rest/geodatas/gsv13_data/gmobile_cayxanh/124
	var madoituong = data_session.key.split("|")[2];
	var lopdoituong = data_session.key.split("|")[1];
	var url = CurrentServer.serverurl + "/gservices/rest/geodatas/" + CurrentServer.dataid + "/" + lopdoituong + "/"  + madoituong;


	var data = [];
	$("#divThongTinchung input").each(function() {
		var a =  $(this);
		data.push({
			"key": a.attr("name"),
			"value": a.val()
		});
	});
	
	if(map.object.location == null || map.object.location == undefined){
		navigator.notification.alert(
	            'Chưa xác định được vị trí', 				// message
	            function(){},         					// callback
	            'Thông báo',           					// title
	            'Ok'                  					// buttonName
	        );
		return;
	}
	
	var xdaidien = map.object.location.xdaidien;
	var ydaidien = map.object.location.ydaidien;
	data.push({
		"key":"xDaiDien","value":xdaidien
	});
	data.push({
		"key":"yDaiDien","value":ydaidien
	});
	data.push({
		"key":"geom",
		"value":"POINT("+ xdaidien + " " +ydaidien+")"
	});

	var data_goc = data;
	//data = [{"key":"tenDoiTuong","value":"vfgbhh1"},{"key":"loaicay","value":"bcc11ddd"},{"key":"chieucao","value":""},{"key":"tailieu","value":""},{"key":"geom","value":"POINT(105.80716838440003 21.096042630197314)"},{"key":"xDaiDien","value":105.80716838440003},{"key":"yDaiDien","value":21.096042630197314}];
	data = JSON.stringify(data);
	
	showLoader("Đang cập nhật đối tượng");
	$.ajax({
         type: 'PUT',
         url: url,
         contentType: "application/json; charset=utf-8",
         data: data,
         success: function (dataResponse) {
             if(dataResponse.code == 1){
            	 alert("Cập nhật thành công");
            	 hideLoader();
            	 model.save({
            		 data: data_goc,
            		 media: $('#listViewImageScreen').html()
            	 });
            	 fnOnSaveScreen(lopdoituong, madoituong);
            	 
             }else{
            	 alert('Cập nhật thất bại' + dataResponse.code+ "__" + dataResponse.message);
            	 hideLoader();
             }
         },
         error: function(xhr, ajaxOptions, thrownError){
        	 alert('Thất bại ' + JSON.stringify(xhr));
        	 hideLoader();
         }
    });
}

function fnActionAddEdit(){
	var type = $('#btnEddEdit').find('.ui-btn-text').text();
	if(type == "Hoàn tất")
		onCreateObject();
	else onEditObject();
}




