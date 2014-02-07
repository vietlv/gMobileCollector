

var myData = "";
var listCreated = false;
var listAttack = [];

function getImageFromLibary()
{
	// Retrieve image file location from specified source
    navigator.camera.getPicture(uploadPhoto, onFail, { quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}
//A button will call this function
//To capture photo
function capturePhoto() {
 // Take picture using device camera and retrieve image as base64-encoded string
 navigator.camera.getPicture(uploadPhoto, onFail, { 
     quality: 50, destinationType: Camera.DestinationType.FILE_URI 
 });
}

function uploadPhoto(imageData) {
	$('.takePhotoImg').css("display","none");
	if(!listCreated){
        $("#listImageScreen").append('<ul id="listViewImageScreen" class="takePhotolistView" data-role="listview" data-split-icon="g-check"  data-split-theme="a" data-inset="true" data-corners="false"></ul>');
        listCreated = true;
        $("#listImageScreen").trigger("create");
    }
	var idCreate= "a"+ Date.now().toString("ddMMyyyyHHssmm");
	var listString = '';
	//Lấy thêm thông tin của ID
	listString +='<li id="'+idCreate+'">';	
	listString +='<a href="#" class="classImages">';
	listString +='<img class="imgAvatar"  style="height:80px; width:80px;position:absolute; top:0;" src="'+imageData+'">';	
	listString +='<h2>'+idCreate+'</h2>';	
	listString +='<p>'+Date.now().toString("dd-MM-yyyy")+'</p>';	
	listString +='</a>';	
	listString +='<select data-theme="c" data-corners="false" multiple="multiple" data-native-menu="true" data-icon="grid" data-iconpos="left">';
	if(listAttack.length > 0)
		for ( var int = 0; int < listAttack.length; int++) {
			var item = listAttack[int];
			listString +='<option selected="true" value="'+item.name+'">'+item.alias+'</option>';
		}
	/*listString +='<option>Ảnh loại 1:</option>';
	listString +='<option value="standard" >Ảnh loại 2</option>';
	listString +='<option value="standard" selected="true">Ảnh loại 3</option>';*/
	listString +='</select>';	
	listString +='<a href="#purchase" data-rel="popup" class="gBizIcon icon-24 featured deleting" onclick="DeleteRecordScreenImage('+"'"+idCreate+"'"+')" data-theme="c" data-position-to="window" data-transition="pop"></a>';	
	listString +='</li>';
	
	$('#listViewImageScreen').append(listString);
	$("#listViewImageScreen").listview("refresh");
	$('select').selectmenu();
 	 		
}


function DeleteRecordScreenImage(id){
	
	$("#listViewImageScreen li").remove( "#"+id );
	
	var liSize=$("#listViewImageScreen li").size();
}

function fnLoadDataEdit(key){
	var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
	_listSession.fetch();

	var ob = _listSession.getObjectByKey(key);
	if(ob != null){
		$("#listImageScreen").html('<ul id="listViewImageScreen" class="takePhotolistView" data-role="listview" data-split-icon="g-check"  data-split-theme="a" data-inset="true" data-corners="false"></ul>');
		$("#listImageScreen").trigger("create");
		$('#listViewImageScreen').empty();
		$('#listViewImageScreen').append(ob.media);
		
		//$('#listViewImageScreen').append(getObjectInArray(ob.data,"htmlListImage").value);
		$('.takePhotolistView select').each(function() {
			$(this.parentElement.parentElement).html('<select data-theme="c" data-corners="false" multiple="multiple" data-native-menu="true" data-icon="grid" data-iconpos="left">'+this.innerHTML+'</select>');
		});
		
		$("#listViewImageScreen").listview("refresh");
		$('select').selectmenu();
		
		//return;
	}
}

function fnOnSaveScreen(lopdoituong, madoituong)
{
	var fileid = CurrentServer.fileid;
	var serverurl = CurrentServer.serverurl;
	var dataid = CurrentServer.dataid;
	var index = 0;
	
	
	/*var htmlListImage = $('#listViewImageScreen').html();
	//key = maBanDo|lopDuLieu|maDoiTuong
	var keyObject = map.maBanDo + "|" + lopdoituong + "|" +madoituong; 
	//Khởi tạo 1 session theo mã bản đồ
	var _listSession = new gMobile.Collections.Sessions("Session_"+ map.maBanDo);
	_listSession.fetch();
	_listSession.addObject(keyObject,dataDoituong, htmlListImage);
	*/
	
	$('#listViewImageScreen li').each(function() {
		 var idli = $(this).attr("id");
		 $(this).find(".gBizIcon").removeClass('deleting').addClass('loading');
		 var img = new Image();
		 img.src = $(this).find(".imgAvatar").attr("src");
		 var image = $(this).find(".imgAvatar").attr("src");
		 var selectMulti = $($(".takePhotolistView select")[index]);
		 index++;
		 var listSelect = selectMulti.val();	//Mảng các trường có type là fobject
		 
		 var options = new FileUploadOptions();
         options.fileKey ="file";
         //options.fileName= image.substr(image.lastIndexOf('/')+1);
         var fileName =  idli + ".jpg";
         options.fileName = fileName;
         options.mimeType ="image/jpeg";

         var params = {};
         /*params.value1 = "test";
         params.value2 = "param";*/

         options.params = params;
         var me =  $(this);
         var truongAttackFirst = listSelect[0];
         var url_file = serverurl + '/gservices/rest/filemanagers/' + fileid + '/folder/'+dataid +'|'+ lopdoituong+ '|' + madoituong+'|'+truongAttackFirst +'/file/upload';
         function win(r) {   
        	me.find(".gBizIcon").removeClass('loading').addClass('active');
        	//Copy file sang các thư mục còn lại
        	if(listSelect.length > 1){
        		for ( var int = 1; int < listSelect.length; int++) {
        			var sourceFile = serverurl + '/gservices/rest/filemanagers/'+ fileid + '/file/'+dataid +'|'+ lopdoituong+ '|' + madoituong +  '|'+ truongAttackFirst +'|' +fileName;
        			var sourceFolder = dataid +'|'+ lopdoituong+ '|' + madoituong +  '|'+ listSelect[int];
					copyFileToFolder(sourceFile, sourceFolder)
				}
        	}
        	
        	//http://10.0.1.49:1113/gservices/rest/filemanagers/filemgr/file/gMobile|a02012014093448.jpg/copy/1|1_copy
        	//copyFileToFolder(sourceFile, sourceFolder)
         }

         function fail(error) {
           /*alert("An error has occurred: Code = " + error.code);
             alert("upload error source " + error.source);
             alert("upload error target " + error.target);*/
         }
         
         //Lấy tên của trường đầu tiên
         
         var ft = new FileTransfer();
         //ft.upload(image, encodeURI("http://10.0.1.49:1113/gservices/rest/filemanagers/filemgr/folder/gMobile/file/upload"), win, fail, options)
         ft.upload(image, encodeURI(url_file), win, fail, options)
	});
	
}

function copyFileToFolder(sourceFile, sourceFolder){
	var url = sourceFile + '/copy/' + sourceFolder;
	$.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if(data.code == 1){
           	 	//alert('CopyFile thành công' + data.message);
           	
            }else{
            	alert('CopyFile thất bại' + data.code+ "__" + data.message);
            }
        },
        error: function(xhr, ajaxOptions, thrownError){
       	 
        }
   });	
}

function onFail(message) {
    //alert('Failed because: ' + message);
}
