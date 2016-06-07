module.exports = {
	development: {
		app: {
			name: 'Plexus!',
			plural_name:'Plexus ®',
			organisation: 'company',//Team, Store, Club etc.
			type: 'Boilerplate',
			registration:{
						registered:true,
						law:'Dutch Law',
						country:'The Netherlands',
						trade_register:'Plexus ®',
						url:'www.plexus.##',
						registration_number:'xxxx-xxxxxx-xxxxxx-x',
						tax_number:'xxxx-xx-xx-xxx-xxxx',
						fullname:'Plexus ®',
						jurisdiction:'Dutch',
						registration_number:'xxxx xxxx xxxxx xxx',
						address:'PO 98009, The Netherlands',
						contact_email:'info@plexus.##'
						},
			terms:{
					age: 16,
					google_analitics:true
				  }
		},
		modules:{
			register: true,
			contact: {
						active:true,
						contact_address:'jelmerstoker@gmail.com'
					 }
		},
		i18n:{
            locales:['be','de','gb','fr','frl','nl','us'],
            directory:__dirname + "/locales/",
            defaultLocale:'gb',
            cookie:'locale',
            updateFiles: true,
            syncFiles: true,
            extension: '.js',
            },
		secret:{
			secret: 'top Secret',
			resave: true,
			saveUninitialized: false,
			locked:false,
  			cookie: { secure: false, maxAge:24*60*60*1000, expires:null}
			},
		session:{
			couchbase:{
						    bucket:"default",               
						    host:"127.0.0.1:8091",                              
						    prefix: 'session'                  
						}
		},	
		db: {
			server: 'couchbase://127.0.0.1',
			bucket: 'default'
		},
		email:{
			service:'',
			address:'jelmerstoker@gmail.com',
			smtp:{ 	   
					host: 'localhost',
					port: 25,
				 },
			auth:{
			   		user: 'jelmerstoker@gmail.com',
			   		pass: ''
				}
		},
		facebook: {
			clientID: "{{PLACEHOLDER}}",
			clientSecret: "{{PLACEHOLDER}}",
			callbackURL: "{{PLACEHOLDER}}"
		},
		google: {
			clientID: "{{PLACEHOLDER}}",
			clientSecret: "{{PLACEHOLDER}}",
			callbackURL: "{{PLACEHOLDER}}"
		}
	},
  	production: {
		app: {
			name: 'Plexus! Create, Read and Compose'
		},
		modules:{
			register: true,
			contact: {
						active:true,
						contact_address:'jelmerstoker@gmail.com'
					 }
		},
		i18n:{
            locales:['be','de','gb','fr','frl','nl','us'],
            directory:__dirname + "/locales/",
            defaultLocale:'gb',
            cookie:'locale',
            updateFiles: true,
            syncFiles: true,
            extension: '.js',
            },  		
		secret:{
			secret: 'top Secret',
			resave: true,
			saveUninitialized: false,
			locked: false,
  			cookie: { secure: false, maxAge:24*60*60*1000, expires:null}
			},
		session:{
			couchbase:{
						    bucket:"default",               
						    host:"127.0.0.1:8091",                            
						    prefix: 'session'                  
						}
		},
		db: {
			server: 'couchbase://127.0.0.1',
			bucket: 'default'
		},
		facebook: {
			clientID: "",
			clientSecret: "",
			callbackURL: ""
		},
		google: {
			clientID: '',
			clientSecret: '',
			callbackURL: ''
		}
 	}
}


