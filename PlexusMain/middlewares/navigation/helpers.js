/* 
* @Project: 	PlexusMain
* -------------------------------------------
* @Author:		JB Stoker
* @Email:  		Jelmer@probo.nl
*
* @File: 		helpers.js
* @Path:		C:\PrivateProjects\PlexusMain\config\env\navigation\helpers.js
* @Created:   	2016-01-11
*
* @Modified by:	JB Stoker
* 
* @Copyright:	Copyright (C) Probo - All Rights Reserved 
*				Unauthorized copying, or using code of this file, trough any medium is strictly prohibited
*				Proprietary and confidential
*/			 
module.exports = function(hbs){
  //Maintopmenu
hbs.registerHelper('topnav', function(){
      var url = this.url,
      //title = '<span class="li-title">'+this.title+'</span>',
      title = this.title,
      children = this.children;

      if(this.liClass.length > 0)
      {
        var liClass = this.liClass;
      }
      else
      {
        var liClass = '';
      }

      if(this.icon.length > 0)
      {
        var icon  = '<svg class="'+ this.icon +'"><use xlink:href="/fonts/icons.svg#'+ this.icon +'"></use></svg>';
      }
      else
      {
        var icon = '';
      }  

      if(this.notify == true)
      {
        var notifyClass = 'notifications'; 
        var count = '<span class="count" style="background-color:'+this.color+'">'+this.count+'</span>';
      }
      else
      {
        var notifyClass = '';
        var count = '';
      } 


      if(children.length > 0)
      {
                //Check if link is of type account.
        if(liClass === 'account')
        {
          var element = '<li class="dropdown"><a href="'+ url +'" class="dropdown-toggle" data-toggle="dropdown"><span id="menu-avatar">'+this.avatar+'</span>'+ icon + title + count +'</a><ul class="dropdown-menu">';
        }
        else
        { 
          var element = '<li class="dropdown"><a href="'+ url +'" class="dropdown-toggle" data-toggle="dropdown">'+ icon + title + count +'</a><ul class="dropdown-menu">';
        } 
        for (var i = 0; i < children.length; i++) 
        {
                if(children[i].liClass.length > 0)
                {
                  var liClass = children[i].liClass;
                }
                else
                {
                  var liClass = '';
                }

                if(children[i].icon.length > 0)
                {
                  var icon  = '<svg class="'+ children[i].icon +'"><use xlink:href="/fonts/icons.svg#'+ children[i].icon +'"></use></svg>';
                }
                else
                {
                  var icon = '';
                }  

                if(children[i].notify == true)
                {
                  var notifyClass = 'notifications'; 
                  var count = '<span class="count" style="background-color:'+children[i].color+'">'+children[i].count+'</span>';
                }
                else
                {
                  var notifyClass = '';
                  var count = '';
                } 
          element += '<li class=""><a href="'+ children[i].url +'">'+ icon + children[i].title + count +'</a></li>';
        }
        element += '</ul>';
      }
      else
      {
      var element = '<li class="'+ liClass + notifyClass +'"><a href="'+ url +'">'+ icon + title + count +'</a>';
      }  
      element += '</li>';
  return new hbs.SafeString(element);
});

//Maintopmenu
hbs.registerHelper('sidenav', function(){
      var url = this.url,
      //title = '<span class="li-title">'+this.title+'</span>',
      title = this.title,
      children = this.children;

      if(this.liClass.length > 0)
      {
        var liClass = this.liClass;
      }
      else
      {
        var liClass = '';
      }

      if(this.smOnlyIcon === true)
      {
        var smOnlyIcon = 'sm-onlyicon';
      }
      else
      {
        var smOnlyIcon = '';
      }

      if(this.icon.length > 0)
      {
        var icon  = '<svg class="'+ this.icon +'"><use xlink:href="/fonts/icons.svg#'+ this.icon +'"></use></svg>';
      }
      else
      {
        var icon = '';
      }  

      if(this.notify == true)
      {
        var notifyClass = 'notifications';  
        var count = '<span class="count" style="background-color:'+this.color+'">'+this.count+'</span>';
      }
      else
      {
        var notifyClass = '';
        var count = '';
      } 
      //Check if link has children
      if(children.length > 0)
      {
        //Check if link is of type account.
        if(liClass === 'account')
        {
          var element = '<li class="has-children account '+ notifyClass + ' ' + smOnlyIcon +'"><a href="#">'+this.avatar+ icon + title + count +'</a><ul>';
        }
        else
        { 
          var element = '<li class="has-children '+ notifyClass + liClass + ' ' + smOnlyIcon +'"><a href="'+ url +'">'+ icon + title + count +'</a><ul>';
        }  
        //Loop trough children object
        for (var i = 0; i < children.length; i++) 
        {
          var title = children[i].title;

          if(children[i].liClass.length > 0)
          {
            var liClass = children[i].liClass;
          }
          else
          {
            var liClass = '';
          }
          
          if(children[i].smOnlyIcon === true)
          {
            var smOnlyIcon = 'sm-onlyicon';
          }
          else
          {
            var smOnlyIcon = '';
          }

          if(children[i].icon.length > 0)
          {
            var icon  = '<svg class="'+ children[i].icon +'"><use xlink:href="/fonts/icons.svg#'+ children[i].icon +'"></use></svg>';
          }
          else
          {
            var icon = '';
          }  

          if(children[i].notify == true)
          {
            var notifyClass = 'notifications'; 
            var count = '<span class="count" style="background-color:'+children[i].color+'">'+children[i].count+'</span>';
          }
          else
          {
            var notifyClass = '';
            var count = '';
          } 

          element += '<li class="'+ notifyClass + liClass + ' ' + smOnlyIcon +'"><a href="'+ children[i].url +'">'+ icon + title + count +'</a></li>';
        }
        element += '</ul>';
      }
      else
      {
        var element = '<li class="'+ notifyClass + liClass + ' ' + smOnlyIcon +'"><a href="'+ url +'">'+ icon + title + count +'</a>';
      }  
      element += '</li>';
  return new hbs.SafeString(element);
});

}