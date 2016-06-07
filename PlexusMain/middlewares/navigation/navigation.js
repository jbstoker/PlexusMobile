module.exports = function(i18n,req,res){

var title = '';
var name = '';
var lastname = '';
var maidenname = ''; 
var avatar = '';

    function upChar(namestring) {
        if (namestring === undefined) {
            return "";
        } else {
            return namestring.charAt(0).toUpperCase() + ".";
        }
    }

    if(res != undefined && res.locals.loggedin === true)
    {
        title = req.user.title;
        name = upChar(req.user.surname) +''+ upChar(req.user.middlename); 
        lastname = req.user.lastname;
        maidenname = req.user.maidenname;

        if(req.user.avatar === undefined || req.user.avatar === '')
        {
            avatar  = '<svg class="icon-id-8" style="height:100%; width:100%; top:-5px; left:-15px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/fonts/icons.svg#icon-id-8"></use></svg>';
        }
        else
        {
            avatar = '<img src="/uploads/avatar/'+req.user.avatar+'" alt="avatar">';
        }    

    }

    //Main menu top and sidebar has one sub possible
   var data =  {
                main: [{
                    liClass: "",
                    url: "/",
                    title: i18n.__('Home'),
                    icon: "",
                    smOnlyIcon: false,
                    notify: false,
                    color: "",
                    count: "",
                    children: []
                } ],
                acl: {
                    locked: [ //loggedout menu has one sub
                    {
                        liClass: "",
                        url: "/login",
                        title: i18n.__('Login'),
                        icon: "icon-lock-2",
                        children: []
                    } ],
                    open: [ //loggedin menu has one sub
                    {
                        liClass: "account",
                        url: "#",
                        title: title +' '+name+' '+lastname+' '+maidenname,
                        avatar: avatar,
                        smOnlyIcon: false,
                        icon: "",
                        notify: false,
                        color: "",
                        count: "",
                        children: [ {
                            liClass: "",
                            url: "/user/profile",
                            title: i18n.__('Profile'),
                            smOnlyIcon: false,
                            icon: "",
                            notify: false,
                            color: "",
                            count: ""
                        }, {
                            liClass: "",
                            url: "/user/settings",
                            title: i18n.__('Settings'),
                            smOnlyIcon: false,
                            icon: "",
                            notify: false,
                            color: "",
                            count: ""
                        }, {
                            liClass: "",
                            url: "/lock",
                            title: i18n.__('Lock'),
                            smOnlyIcon: false,
                            icon: "",
                            notify: false,
                            color: "",
                            count: ""
                        }, {
                            liClass: "",
                            url: "/logout",
                            title: i18n.__('Logout'),
                            smOnlyIcon: false,
                            icon: "",
                            notify: false,
                            color: "",
                            count: ""
                        } ]
                    } ]
                },
                sidebar: [ //Sidebar menu has two submenus
                {
                    liClass: "",
                    url: "/manage_users",
                    title: i18n.__('User management'),
                    smOnlyIcon: false,
                    icon: "",
                    notify: false,
                    color: "",
                    count: "",
                    children: []
                },
                {
                    liClass: "",
                    url: "/settings",
                    title: i18n.__('Global Settings'),
                    smOnlyIcon: false,
                    icon: "",
                    notify: false,
                    color: "",
                    count: "",
                    children: [] 
                }]
            };

    return data;
}