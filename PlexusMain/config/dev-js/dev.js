$(document).ready(function() 
{       
          



	//Auto close bootstrap alerts
   setTimeout(function() {
        $(".alert").fadeTo(1500, 500).slideUp(500, function(){ $(".alert").alert('close'); });
    }, 1500);

})
