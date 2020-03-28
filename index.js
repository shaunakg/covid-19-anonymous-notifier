
// COVID-19 Anonymous Notifer (NodeJS Server Program)
// Repository: https://github.com/shaunakg/covid-19-anonymous-notifier
// Issues/Bugs: https://github.com/shaunakg/covid-19-anonymous-notifier/issues

// Initialise env and modules
require('dotenv').config({path:'sendgrid.env'});
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const webport = process.env.PORT || 8080;

// Initialise SendGrid's API
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Read static email contents
var notifHtml = fs.readFileSync(__dirname + '/static/notif-html.html', 'utf8');
var notifTextOnly = fs.readFileSync(__dirname + '/static/notif.txt', 'utf8');
var processed_emails = [];

console.log(process.env.SENDGRID_API_KEY);

app.use(express.static("static"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

app.get("/api/testing", function (req, res) {

	res.send(req.query);

});

app.get("/api/notify", function (req, res) {

	if (req.query.emails) {

		var emails = req.query.emails.split(",");
		var repeat_emails = [];

		for (i = 0; i < emails.length; i++) {
			if (processed_emails.includes(emails[i]) && emails[i] != "test@example.com") {
				repeat_emails.push(emails.splice(i, 1));
			} else {
				processed_emails.push(i)
			}
		}

		console.log("Processing emails: " + emails);
		console.log("Excluding repeats: "+ repeat_emails);

		const msg = {
			to: emails,
			from: 'notification@covid-anonymous.shaunakg.me',
			subject: 'Important! Someone you were in contact with recently tested positive to COVID-19',
			text: notifTextOnly,
			html: notifHtml,
		};

		sgMail.sendMultiple(msg).then(() => {

			if (repeat_emails.length > 0) {
				res.redirect("../../?status=200_repeat_emails&emails=" + emails.join() + "&repeats=" + repeat_emails.join());
			} else {
				res.redirect("../../?status=200_send_ok&emails=" + emails.join());
			}

		}).catch(error => {

			console.error(error.toString());
			const {message, code, response} = error;
			const {headers, body} = response;

			res.redirect("../../?status=400_email_send_err&emails=" + emails.join());

		});

	} else {
		
		res.redirect("../../?status=400_wrong_params&emails=" + emails.join())

	}

});

http.listen(webport, function(){
    console.log('listening on *:' + webport);
});