
// Initialise custom environment variables (like Twilio account SIDs and authorisation tokens)
require('dotenv').config({path:'sendgrid.env'});
var fs = require('fs');
var notifHtml = fs.readFileSync(__dirname + '/static/notif-html.html', 'utf8');
var notifTextOnly = fs.readFileSync(__dirname + '/static/notif.txt', 'utf8');
var to_user = "";

console.log(process.env.SENDGRID_API_KEY);

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
	to: to_user,
	name: 'Shaunak Gadkari',
	from: 'notification@covid-anonymous.shaunakg.me',
	subject: 'Important! Someone you were in contact with recently tested positive to COVID-19',
	text: notifTextOnly,
	html: notifHtml,
};

sgMail
	.send(msg)
	.then(() => {
    	//Celebrate
  	})
  	.catch(error => {
		//Log friendly error
		console.error(error.toString());

		//Extract error msg
		const {message, code, response} = error;

		//Extract response msg
		const {headers, body} = response;
});