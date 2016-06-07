/*
* @Author: JB Stoker
* @Date:   2016-05-20 09:07:44
* @Last Modified by:   JB Stoker
* @Last Modified time: 2016-05-20 09:31:10
*/

var nodemailer = require('nodemailer'),
smtpTransport = require('nodemailer-smtp-transport'),
env = process.env.NODE_ENV || 'development', 
config = require('../../config/env/config')[env];

function Mailer(){};


function transport(service)
{	
	if(service != 'smpt' && service != '')
	{	
		return nodemailer.createTransport(smtpTransport({
							   service: service,
							   auth: {
							       user: config.email.auth.user,
							       pass: config.email.auth.pass
							   }
							}));
	}
	else  
	{
		if(service == 'smtp')
		{
			return  nodemailer.createTransport(smtpTransport({
							   host: config.email.smtp.host,
							   port: config.email.smtp.port,
							   auth: {
							       user: config.email.auth.user,
							       pass: config.email.auth.pass
							   }
							}));
		}
		else
		{
			return nodemailer.createTransport();
		}		
	}
}

Mailer.sendmail = function(to, subject,body,bodyType)
{
	var service = config.email.service;
	var transporter = transport(service);

	if(bodyType == 'html')
	{
		transporter.sendMail({
		   from: config.email.address,
		   to: to,
		   subject: subject,
		   html: body
		});
	}
	else
	{
		transporter.sendMail({
		   from: config.email.address,
		   to: to,
		   subject: subject,
		   text: body
		});		
	}	
	transporter.close();
};


module.exports = Mailer;