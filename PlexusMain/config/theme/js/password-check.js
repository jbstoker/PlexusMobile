/* 
* @Project: 	PlexusMain
* -------------------------------------------
* @Author:		JB Stoker
* @Email:  		Jelmer@probo.nl
*
* @File: 		password-check.js
* @Path:		C:\PrivateProjects\PlexusMain\config\theme\js\password-check.js
* @Created:   	2016-02-08
*
* @Modified by:	JB Stoker
* 
* @Copyright:	Copyright (C) Probo - All Rights Reserved 
*				Unauthorized copying, or using code of this file, trough any medium is strictly prohibited
*				Proprietary and confidential
*/			 			 

jQuery(document).ready(function($) {
	

$("#password1, #password2").keyup(function()
    {
        var ucase = new RegExp("[A-Z]+");
        var lcase = new RegExp("[a-z]+");
        var num = new RegExp("[0-9]+");
        
        if($("#password1").val().length >= 8){
            $("#password_8char").removeClass("glyphicon-remove");
            $("#password_8char").addClass("glyphicon-ok");
            $("#password_8char").css("color","#00A41E");
        }else{
            $("#password_8char").removeClass("glyphicon-ok");
            $("#password_8char").addClass("glyphicon-remove");
            $("#password_8char").css("color","#FF0004");
        }
        
        if(ucase.test($("#password1").val())){
            $("#password_ucase").removeClass("glyphicon-remove");
            $("#password_ucase").addClass("glyphicon-ok");
            $("#password_ucase").css("color","#00A41E");
        }else{
            $("#password_ucase").removeClass("glyphicon-ok");
            $("#password_ucase").addClass("glyphicon-remove");
            $("#password_ucase").css("color","#FF0004");
        }
        
        if(lcase.test($("#password1").val())){
            $("#password_lcase").removeClass("glyphicon-remove");
            $("#password_lcase").addClass("glyphicon-ok");
            $("#password_lcase").css("color","#00A41E");
        }else{
            $("#password_lcase").removeClass("glyphicon-ok");
            $("#password_lcase").addClass("glyphicon-remove");
            $("#password_lcase").css("color","#FF0004");
        }
        
        if(num.test($("#password1").val())){
            $("#password_num").removeClass("glyphicon-remove");
            $("#password_num").addClass("glyphicon-ok");
            $("#password_num").css("color","#00A41E");
        }else{
            $("#password_num").removeClass("glyphicon-ok");
            $("#password_num").addClass("glyphicon-remove");
            $("#password_num").css("color","#FF0004");
        }
                    
        if($("#password1").val() == $("#password2").val() && $("#password1").val() != '' && $("#password2").val() != ''){
            $("#password_pwmatch").removeClass("glyphicon-remove");
            $("#password_pwmatch").addClass("glyphicon-ok");
            $("#password_pwmatch").css("color","#00A41E");
        }else{
            $("#password_pwmatch").removeClass("glyphicon-ok");
            $("#password_pwmatch").addClass("glyphicon-remove");
            $("#password_pwmatch").css("color","#FF0004");
        }
    });

})