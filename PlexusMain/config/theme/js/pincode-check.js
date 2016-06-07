/* 
* @Project: 	PlexusMain
* -------------------------------------------
* @Author:		JB Stoker
* @Email:  		Jelmer@probo.nl
*
* @File: 		pincode-check.js
* @Path:		C:\PrivateProjects\PlexusMain\config\theme\js\pincode-check.js
* @Created:   	2016-02-08
*
* @Modified by:	JB Stoker
* 
* @Copyright:	Copyright (C) Probo - All Rights Reserved 
*				Unauthorized copying, or using code of this file, trough any medium is strictly prohibited
*				Proprietary and confidential
*/
jQuery(document).ready(function($) {
	
$("#pincode, #repeat_pincode").keyup(function()
    {            
      if($("#pincode").val() == $("#repeat_pincode").val() && $("#pincode").val() != '' && $("#repeat_pincode").val() != ''){
            $("#pincode_match").removeClass("glyphicon-remove");
            $("#pincode_match").addClass("glyphicon-ok");
            $("#pincode_match").css("color","#00A41E");
        }else{
            $("#pincode_match").removeClass("glyphicon-ok");
            $("#pincode_match").addClass("glyphicon-remove");
            $("#pincode_match").css("color","#FF0004");
        }
    });

})