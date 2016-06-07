jQuery(document).ready(function(){
	//cache DOM elements
	var mainContent = $('.cd-main-content'),
		header = $('.cd-main-header'),
		sidebar = $('.cd-side-nav'),
		sidebarTrigger = $('.cd-nav-trigger'),
		topNavigation = $('.cd-top-nav'),
		searchForm = $('.cd-search'),
		accountInfo = $('.account');
	//on resize, move search and top nav position according to window width
	var resizing = false;
	moveNavigation();
	$(window).on('resize', function(){
		if( !resizing ) {
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
			resizing = true;
		}
	});
	//mobile only - open sidebar when user clicks the hamburger menu
	sidebarTrigger.on('click', function(event){
		event.preventDefault();
		$([sidebar]).toggleClass('nav-is-visible');
		$([sidebarTrigger]).toggleClass('collapsed');
	});
	//click on item and show submenu
	$('.has-children > a').on('click', function(event){
		var mq = checkMQ(),
			selectedItem = $(this);
		if( mq == 'mobile' || mq == 'tablet' ) {
			event.preventDefault();
			if( selectedItem.parent('li').hasClass('selected')) {
				selectedItem.parent('li').removeClass('selected');
			} else {
				sidebar.find('.has-children.selected').removeClass('selected');
				accountInfo.removeClass('selected');
				selectedItem.parent('li').addClass('selected');
			}
		}
	});
	$( "#nav-side-toggle" ).on( "click", function(e) {
	  e.preventDefault();
	    if($(this).attr('class') === "active")
	    {
	        $(this).attr('class', '');
	        $('.cd-side-nav ').show();
	        $('.content-wrapper').css('margin-left', '110px');
	    }   
	    else
	    {
	        $(this).attr('class', 'active');
	        $('.cd-side-nav ').hide();
	        $('.content-wrapper').css('margin-left', '5px');
	    } 
	});
	//click on account and show submenu - desktop version only
	accountInfo.children('a').on('click', function(event){
		var mq = checkMQ(),
			selectedItem = $(this);
		if( mq == 'desktop') {
			event.preventDefault();
			accountInfo.toggleClass('selected');
			sidebar.find('.has-children.selected').removeClass('selected');
		}
	});
	$(document).on('click', function(event){
		if( !$(event.target).is('.has-children a') ) {
			sidebar.find('.has-children.selected').removeClass('selected');
			accountInfo.removeClass('selected');
		}
	});
	//on desktop - differentiate between a user trying to hover over a dropdown item vs trying to navigate into a submenu's contents
	sidebar.children('ul').menuAim({
        activate: function(row) {
        	$(row).addClass('hover');
        },
        deactivate: function(row) {
        	$(row).removeClass('hover');
        },
        exitMenu: function() {
        	sidebar.find('.hover').removeClass('hover');
        	return true;
        },
        submenuSelector: ".has-children",
    });
	function checkMQ() {
		//check if mobile or desktop device
		if (!$(".cd-main-content").length)
		{
			return window.getComputedStyle(document.querySelector('.main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}
		else
		{
			return window.getComputedStyle(document.querySelector('.cd-main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}	
	}
	function moveNavigation(){
  		var mq = checkMQ();
		if (!$(".main-content").length)
		{
        	if ( mq == 'mobile' && topNavigation.parents('.cd-side-nav').length == 0 ) {
        		detachElements();
				topNavigation.appendTo(sidebar);
				searchForm.removeClass('is-hidden').prependTo(sidebar);
			} else if ( ( mq == 'tablet' || mq == 'desktop') &&  topNavigation.parents('.cd-side-nav').length > 0 ) {
				detachElements();
				searchForm.insertAfter(header.find('.cd-logo'));
				topNavigation.appendTo(header.find('.cd-nav'));
			}
		}
		checkSelected(mq);
		resizing = false;
	}
	function detachElements() {
		topNavigation.detach();
		searchForm.detach();
	}
	function checkSelected(mq) {
		//on desktop, remove selected class from items selected on mobile/tablet version
		if( mq == 'desktop' ) $('.has-children.selected').removeClass('selected');
	}
	function onlyIcon()
  	{
  	var num = parseInt($('.cd-side-nav').css('width'));
  	  if(num === 110)
  	    {
  	      $('.sm-onlyicon .li-title').hide();  
  	      $('nav ul li.sm-onlyicon a svg').attr('style', 'margin:5px 20px !important;  width:40px !important;');
  	    }
  	    else if(num === 193)  
  	    { 
  	      $('.sm-onlyicon .li-title').show();
  	      $('nav ul li.sm-onlyicon a svg').attr('style', 'margin:3px 10px 0px 0px !important;  width:20px !important;');
  	    }
  	    else if(num > 130 && num < 750)
  	    {
  	      $('.sm-onlyicon .li-title').show();  
  	      $('nav ul li.sm-onlyicon a svg').attr('style', 'margin:15px 10px 15px 0px !important;  width:20px !important;');
  	    }
  	}
  	function cHeight() 
    {
        var a = $(window).height();
        var b = $('#footer').innerHeight();
        var c = a - b;
        $('.main-content').css('min-height', c);
        $('.cd-main-content ').css('min-height', c);
    }  
    function resizeContentWrapper()
    {
    	  var navbarHeight = $('.navbar').innerHeight()
    	if(navbarHeight > 46)
    	{ // menu is bigges enlarge paddding content wrapper
    	  var newHeight = navbarHeight + 9;
    	  $('.content-wrapper').attr('style', 'padding:'+newHeight+'px 10px !important');
		}
		else
		{
    	  $('.content-wrapper').attr('style', 'padding:55px 10px !important');
		}	
	}
    $(window).on('resize', function(){
    	cHeight();
      	onlyIcon();
  		resizeContentWrapper();
    });
  cHeight();
  onlyIcon();
  resizeContentWrapper();
})