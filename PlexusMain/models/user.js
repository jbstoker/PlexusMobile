/*
* @Author: JB Stoker
* @Date:   2016-04-16 13:56:53
* @Last Modified by:   JB Stoker
* @Last Modified time: 2016-06-05 07:28:28
*/
var uuid = require("uuid"),
db = require("../app").bucket,
N1qlQuery = require('couchbase').N1qlQuery,
ViewQuery = require('couchbase').ViewQuery,
gm = require('gm'),
i18n = require('i18n'),
hash = require('../config/env/acl/middlewares/hash'),
mailer = require('../middlewares/mailer/mailer'),
moment = require('moment'),
sanitizeHtml = require('sanitize-html'),
env = process.env.NODE_ENV || 'development', 
config = require('../config/env/config')[env];

function UserModel(){};

UserModel.createOrUpdate = function(uid,data, callback) 
{
	var documentId = uid ? uid : uuid.v4();
	hash(data.password, function(err, salt, hash)
	{
		if(err) throw err;
		{
            var code = Math.random().toString(36).substring(7);
    		var userObject = {  type: 'user',
								uid: documentId,
                                gender: 'intersex',                
                                title: '',                
                                surname: data.fullname,                
                                middlename: '',                
                                lastname: '',                
								maidenname: '', 				
    					    	email: data.email, 			
                                phone: '',          
    					    	mobile: '', 			
    					    	address:{ 							
                                            street:'',
    					    				number:'',
    					    				postalcode:'',
    					    				city:'',
    					    				country:'',
    					    			},
    					    	website: '',			
    					    	birthday: new Date(),
    					    	avatar: '',			
    					    	info:{								
    					    			personal_text: '',
    					    			quote: '',
    					    		 },
    					    	locale: 'nl',
    					    	login: data.email,		
    					    	salt: salt,		
						    	hash: hash,		
						    	pincode:  '',
						    	acl:{								
						    	     	status: '0',
						    	     	code: code,
						    	     },  	
    					    	apikey: '',		
    					    	apisecret: '',		
						    	facebook:{							
						    				socialID: '',
						    				email: '',
						    				name: ''
						    			},
						    	google:{							
						    				socialID: '',
						    				email: '',
						    				name: ''
						    			},
    					    	createdOn: new Date(),
						    	role :{
                                        uid:'',
                                        text:''

                                }};

			db.upsert(documentId, userObject, function(error, result) 
			{
			    if(error){
    			    		return  callback(error, null);

			    		  }
                    var subject = i18n.__('Welcome!');         
                    var body = i18n.__('You just created an new account at ')+ config.app.name +'.</p>'+
                               '<a href="http://localhost:3000/activate?code='+code+'">'+ i18n.__('Please Activate your account by visiting this link.') + '</a>';

                    mailer.sendmail(data.email, subject, body,'html');        
          

			    return callback(null, {message: "success", data: userObject});
            });                  
		}
	});
};
//End UserModel Signup
//End UserModel.sendmail
UserModel.SendMail = function(userId,params, callback) 
{
                db.get(userId, function(error, result) 
                {
                    if(error) 
                    {
                        return callback(error, null);
                    }
                    var to = result.value.email;
                    var subject = sanitizeHtml(params.subject);         
                    var body = sanitizeHtml(decodeURIComponent(params.body));
                    
                    mailer.sendmail(to, subject, body, 'html');        

                return callback(null, {message: "success", data: result});
                });     
};
/**
 * Send Email from ContactForm at the login/register/contact page
 * @param {[type]}   params   [description]
 * @param {Function} callback [description]
 */
UserModel.ContactMail = function(params, callback) 
{                               
                    var to = config.modules.contact.contact_address;
                    var subject = 'From: '+params.name+' :: '+params.email;         
                    var body = sanitizeHtml(decodeURIComponent(params.body));
                    
                    mailer.sendmail(to, subject, body, 'text');
                    return callback(null);
};
//Find user by email
UserModel.findByEmailOrLogin = function(email, callback) 
{
 var query = ViewQuery.from('users', 'userbyemailandlogin').key(email).stale(1);

    db.query(query, function(error, result) 
    {
        if(error)
        {
            return callback(error, null);
        }
        else
        {
            return callback(null, result);
        }    
    });
};
//UserModel GetByDocumentId
UserModel.getByDocumentId = function(documentId, callback) 
{
    db.get(documentId,{stale:1}, function(error, result) 
    {
        if(error)
        {
            return callback(error, null);
        }
        return callback(null, result.value);
    });
};
//End UserModel GetByDocumentId
//UserModel DeleteUser
UserModel.DeleteUser = function(documentId, callback) 
{
    db.remove(documentId, function(error, result) 
    {
        if(error) 
        {
            return callback(error, null);
        }
       return callback(null, {message: "success", data: result});
    });
};
//End UserModel DeleteUser
//End UserModel getAllUsers
UserModel.isValidUserPassword = function(email, password, done)
{
 var query = ViewQuery.from('users', 'userbylogin').key(encodeURIComponent(email)).stale(1);
    db.query(query, function(error, result) 
    {
        if(error)
        { 
            return done(null, false,error);
        }
        else
        {
            if(result.length > 0) 
            {
                hash(password, result[0].value.salt, function(err, hash)
                {   
                    if(err)
                    {
                        return done(err); 
                    }
                    else
                    {
                        var dbHash = new Buffer(result[0].value.hash.data);
                        if(hash.toString() == dbHash.toString())
                        { 
                            return done(null, result[0].value, 'Welcome!');
                        }
                        else
                        {
                            return done(null, false, i18n.__('Your password is not correct!'));
                        }
                    }    
                });
            }
            else
            {
                return done(null, false,i18n.__('Your login does not exists within our system'));
        	}	
        }    
            
    });    
};
//End UserModel.isValidUserPassword
UserModel.findUserAndUpdate = function(userId, profile, callback) 
{
    db.get(userId, function(error, result) 
    {
        if(error) {
            return callback(error, null);
        }
        var userDocument = result.value;
        userDocument.gender = profile.gender;
        userDocument.title = profile.title;
        userDocument.surname = profile.surname;
        userDocument.middlename = profile.middlename;
        userDocument.lastname = profile.lastname;
        userDocument.maidenname = profile.maidenname;
        userDocument.email = profile.email;
        userDocument.phone = profile.phone;
        userDocument.mobile = profile.mobile;
        userDocument.address.street = profile.address;
        userDocument.address.number = profile.number;
        userDocument.address.postalcode = profile.postalcode;
        userDocument.address.city = profile.city;
        userDocument.address.country = profile.country;
        userDocument.website = profile.website;
        userDocument.birthday = profile.birthday;
        userDocument.info.personal_text = profile.personal_info;
        userDocument.info.quote = profile.personal_quote;


        db.replace(userId, userDocument, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            return callback(null, userDocument);
        });
    });
};
UserModel.setLocale = function(userId, locale, callback) 
{
    db.get(userId, function(error, result) 
    {
        if(error) {
            return callback(error, null);
        }

        var userDocument = result.value;
        userDocument.locale = locale;


        db.replace(userId, userDocument, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            return callback(null, userDocument);
        });
    });
};
//End UserModel.findUserAndUpdate
UserModel.findAvatarAndUpdate = function(file,params,userId,newfilename, callback) 
{
	gm(file.buffer,newfilename).crop(params.width, params.height, params.x, params.y).resize(200,200).write('public/uploads/avatar/'+newfilename, function (err){
	  if (err){
	  			throw err;
	  		  }
	  		  else
	  		  {
			    db.get(userId,{stale:1}, function(error, result) {
			        if(error) 
			        {
			            return callback(error, null);
			        }
			        
			        var userDocument = result.value;
			        userDocument.avatar = newfilename;
			        db.replace(userId, userDocument, function(error, result) 
			        {
			            if(error) 
			            {
			                return callback(error, null);
			            }
			            return callback(null, userDocument);
			        });
			    });
	  		  } 
	});
};
//End UserModel.findAvatarAndUpdate
UserModel.findACLUserAndUpdate = function(userId,params, callback) 
{
	if(params.user_accepted === undefined){ params.user_accepted = '0'};
	if(params.user_role === undefined){ params.user_role = ''};

			    db.get(userId, function(error, result) 
			    {
                    
                    if(error) 
                    {
                        return callback(error, null);
                    }

                    var userDocument = result.value;
                    userDocument.title = params.user_title;
                    userDocument.surname = params.user_surname;
                    userDocument.middlename = params.user_middlename;
                    userDocument.lastname = params.user_lastname;
                    userDocument.maidenname = params.user_maidenname;
                    userDocument.email = params.user_email;
                    userDocument.acl.status = params.user_accepted;

                    db.get(params.user_role, function(error, result) 
                    {

                        if(error) 
                        {
                            return callback(error, null);
                        }

                    userDocument.role.uid = result.value.uid;
                    userDocument.role.text = result.value.name;

                        db.replace(userId, userDocument, function(error, result) 
                        {

    			            if(error) 
    			            {
    			                return callback(error, null);
    			            }
    			            return callback(null,{message: 'success', data: userDocument});
    			        });
                    });   

			    });    	
};
//End UserModel.findACLUserAndUpdate
UserModel.createACLUser = function(params, callback) 
{
 var query = ViewQuery.from('users', 'userbyemailandlogin').key(encodeURIComponent(params.user_email)).stale(1);
    
    db.query(query,  function(error, result) 
    {
        if(error){  
            return callback(error, {message: "danger", data: error.message});
        }

        if(params.user_accepted === undefined){ params.user_accepted = '0'};
        if(params.user_role === undefined){ params.user_role = ''}; 
        
        var documentId = uuid.v4();

        if(result.length <= 0) 
        {
            db.get(params.user_role, function(error, result) 
            {
                if(error) 
                {
                    return callback(error, {message:'error',data:i18n.__('User role failed to fetch name!')});
                }
                else
                {

                   
                    var code = Math.random().toString(36).substring(7);
                    var genpass = Math.random().toString(36).substring(7);
                    hash(genpass, function(err, salt, hash)
                    {
                        if(err) throw err;
                        
                            var userObject =    {  
                                               type: 'user',
                                               uid: documentId,
                                               gender: 'intersex',                
                                               title: params.user_title,
                                               surname: params.user_surname,
                                               middlename: params.user_middlename,
                                               lastname: params.user_lastname,
                                               maidenname: params.user_maidenname,                 
                                               email: params.user_email,          
                                               phone: '',          
                                               mobile: '',             
                                               address:{                           
                                                       street:'',
                                                       number:'',
                                                       postalcode:'',
                                                       city:'',
                                                       country:'',
                                                   },
                                               website: '',            
                                               birthday: new Date(),
                                               avatar: '',         
                                               info:{                              
                                                       personal_text: '',
                                                       quote: '',
                                                    },
                                               locale: 'nl',
                                               login: params.user_email,      
                                               salt: salt,     
                                               hash: hash,     
                                               pincode:  '',
                                               acl:{                               
                                                       status: params.user_accepted,
                                                       code: code,
                                                    },     
                                               apikey: '',     
                                               apisecret: '',      
                                               facebook:{                          
                                                           socialID: '',
                                                           email: '',
                                                           name: ''
                                                       },
                                               google:{                            
                                                           socialID: '',
                                                           email: '',
                                                           name: ''
                                                           },
                                               createdOn: new Date(),
                                               role :{
                                                       uid:params.user_role,
                                                       text:result.value.name
                                                       }
                                                };
                        
                            db.upsert(documentId, userObject, function(error, result) 
                            {
                            if(error){
                                        return callback(error);
                                     }
    
                            var subject = i18n.__('New account at ');         
                            var body =  '<p>'+i18n.__('There has been an new account created for you at ')+ config.app.name +'.</p>'+
                                        '<p><table><tr><td>'+i18n.__('Login')+'</td><td>'+params.user_email+'</td></tr><tr><td>'+i18n.__('Password')+'</td><td>'+genpass+'</td></tr></table></p>'+
                                        '<a href="http://localhost:3000/activate?code='+code+'">'+i18n.__('Please Activate by visiting this link.')+'</a>';                        
                                       
                                        mailer.sendmail(params.user_email, subject, body,'html');        
    
                            return callback(null, {message: 'success', data: userObject});
                            });                 
                        
                    });
                }       
            });   
        } 
        else 
        {
            return callback(true, {message: "danger", data: i18n.__('The email address is already registered! Please enter a new one.')});

        }
    }); 
};
//End UserModel getAllUsers
UserModel.doAccessCheck = function(params, done)
{
 var query = ViewQuery.from('users', 'userbylogin').key(encodeURIComponent(params.email)).stale(1);

    db.query(query, function(error, result) 
    {
        if(error)
        { 
            return done(null, false, error);
        }
        else
        {
           if(result.length > 0) 
            {
                hash(params.password, result[0].value.salt, function(err, hash)
                {   
                    if(err)
                    {
                        return done(err); 
                    }
                    else
                    {
                        var dbHash = new Buffer(result[0].value.hash.data);
                        if(hash.toString() == dbHash.toString())
                        { 
                            return done(null, result[0].value.uid);
                        }
                        else
                        {
                            return done(null,i18n.__('Your password is not correct!'));
                        }
                    }    
                });
            }
            else
            {
                return done(null,i18n.__('Your login failed, try again'));
            }   
        }    
            
    }); 

UserModel.UpdateLogin = function(userId, params, callback) 
{
    db.get(userId, function(error, result) 
    {
        if(error) {
            return callback(error, null);
        }
        var userDocument = result.value;
        userDocument.login = params.login;

        db.replace(userId, userDocument, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            return callback(null, userDocument);
        });
    });
};


UserModel.UpdatePass = function(userId, params, callback) 
{
    db.get(userId, function(error, result) 
    {
        if(error) {
            return callback(error, null);
        }
        var userDocument = result.value;
            
            hash(params.password, function(err, salt, hash)
            {
                userDocument.salt = salt;
                userDocument.hash = hash;

                db.replace(userId, userDocument, function(error, result) {
                    if(error) {
                        return callback(error, null);
                    }
                    return callback(null, userDocument);
                });
            });
    });
};


UserModel.UpdatePincode = function(userId, params, callback) 
{
    db.get(userId, function(error, result) 
    {
        if(error) {
            return callback(error, null);
        }
        var userDocument = result.value;
        userDocument.pincode = params.pincode;

        db.replace(userId, userDocument, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            return callback(null, userDocument);
        });
    });
};

































};
//End UserModel.doAccesCheck

//End UserModel.createACLUser
module.exports = UserModel;