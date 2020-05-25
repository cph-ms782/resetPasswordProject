require('dotenv').config();
const { User, ResetToken } = require('../models');
const mailer = require('../utils/mailer');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const pug = require('pug');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// ny add-user endpoint så man kan oprette sig fra hjemmeside
router.post('/add-user', async function(req, res, next) {
	try {
		try {
			// await ResetToken.destroy({
			// 	where: {
			// 		used: 1
			// 	}
			// });
			console.log('add req.body.email', req.body.email);
			let user = await User.findOne({ where: { email: req.body.email } });
			console.log('adduser user', user);
			if (user == null) {
				//token expires after one hour
				let createDate = new Date();

				//insert token data into DB
				await User.create({
					username: 'testuser',
					email: req.body.email,
					password: req.body.password,
					createdAt: createDate,
					updatedAt: createDate
				});
			}
		} catch (err) {
			return { code: err, message: err };
		}
	} catch (err) {
		next(err);
	}
});
// ny get-user endpoint så man kan se brugeren
router.post('/get-user', async function(req, res, next) {
	try {
		try {
			let user = await User.findOne({ where: { email: req.body.email } });
			console.log('get-user user', user);
			return res.json(user);
		} catch (err) {
			return { code: err, message: err };
		}
	} catch (err) {
		next(err);
	}
});
// ny get-token endpoint så man kan se brugeren
router.post('/get-user-token', async function(req, res, next) {
	try {
		try {
			console.log('get req.body.email', req.body.email);
			// let token = await ResetToken.findOne({
			// 	where: {
			// 		email: req.body.email,
			// 	}
			// });

			let token = await ResetToken.findOne({
				where: {
					email: req.body.email,
				},
				order: [ [ 'expiration', 'DESC' ] ]
			});

			return res.json(token);
		} catch (err) {
			return { code: err, message: err };
		}
	} catch (err) {
		next(err);
	}
});

router.get('/forgot-password', async function(req, res, next) {
	try {
		res.render('forgot-password', {});
	} catch (err) {
		next(err);
	}
});

router.post('/forgot-password', async function(req, res, next) {
	try {
		//ensure that you have a user with this email
		console.log('Got body:', req.body);
		var email = await User.findOne({ where: { email: req.body.email } });
		/**
		 * vi vil ikke fortælle at en email ikke eksisterer så alle requests bliver besvaret
		 * med ok
		 **/
		if (email == null) {
			return res.json({ status: 'ok' });
		}

		/**
		 * Lad tokens som tidligere er brugt udløbe ved at
		 * sætte used til 1. Så kan den slettes senere og man 
		 * undgår at den benyttes igen
		 **/
		try {
			const newLocal = await ResetToken.update(
				{
					used: 1
				},
				{
					where: {
						email: req.body.email
					}
				}
			);
		} catch (err) {
			return { code: err, message: err };
		}

		//Create a random reset token
		var token = crypto.randomBytes(64).toString('base64');

		//token expires after one hour
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + 1 / 24);

		//insert token data into DB
		await ResetToken.create({
			email: req.body.email,
			expiration: expireDate,
			token: token,
			used: 0
		});

		//create email
		const message = {
			from: process.env.SENDER_ADDRESS,
			to: req.body.email,
			replyTo: process.env.REPLYTO_ADDRESS,
			subject: process.env.FORGOT_PASS_SUBJECT_LINE,
			text:
				'For at nulstille dit kodeord, tryk på linket her nedendunder.\n\n' +
				process.env.DOMAIN +
				'/user/reset-password?token=' +
				encodeURIComponent(token) +
				'&email=' +
				req.body.email
		};

		//send email
		mailer.sendMail(message, function(err, info) {
			if (err) {
				console.log(err);
			} else {
				console.log(info);
			}
		});

		return res.json({ status: 'ok' });
	} catch (err) {
		next(err);
	}
});

router.get('/reset-password', async function(req, res, next) {
	/**
	 * Så nedenstående sletter alle database værdier med en dato før idag. Da et token
	 * alligevel kun holder i en time går det i 23 timer ud af 24. Dette burde blive overtaget af et cronjob,
	 * for at holde tabellen så lille som muligt. F.eks. kørende om natten kl 3.
	 * 
	 * Sequelize.fn() opretter et objekt, der repræsenterer en databasefunktion. 
	 * Dette kan bruges i søgeforespørgsler, både i hvor og rækkefølge 
	 * dele, og som standardværdier i kolonnedefinitioner.
	 * Sequelize.fn('CURDATE'): benyt mysql CURDATE() funktion. I MySQL returnerer 
	 * CURDATE () den aktuelle dato i 'YYYY-MM-DD' format eller 'YYYYMMDD' format 
	 * afhængigt af om numerisk eller streng bruges i funktionen.
	 * 
	 * [Op.lt] - Sequelize.Op: Operators. [Op.lt] find alle værdier mindre end.

     **/
	try {
		await ResetToken.destroy({
			where: {
				expiration: { [Op.lt]: Sequelize.fn('CURDATE') }
			}
		});

		//find the token
		// [Op.gt]:s greater than
		var record = await ResetToken.findOne({
			where: {
				email: req.query.email,
				expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
				token: req.query.token,
				used: 0
			}
		});

		if (record == null) {
			return res.render('reset-password', {
				message: 'Token er udløbet. Prøv kodeords nulstilling igen.',
				showForm: false
			});
		}

		res.render('reset-password', {
			showForm: true,
			record: record
		});
	} catch (err) {
		next(err);
	}
});

router.post('/reset-password', async function(req, res, next) {
	//compare passwords
	try {
		if (req.body.password1 !== req.body.password2) {
			return res.json({ status: 'error', message: 'Kodeord matcher ikke. Prøv igen.' });
		}

		/**
		 * TODO
		 * kodeords validering:  >= 8 chars, alphanumeric,
		 * has special chars, etc
		**/
		const isValidPassword = (password) => {
			return true; // TODO
		};

		if (!isValidPassword(req.body.password1)) {
			return res.json({
				status: 'error',
				message: 'Password does not meet minimum requirements. Please try again.'
			});
		}

		var record = await ResetToken.findOne({
			where: {
				email: req.body.email,
				expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
				token: req.body.token,
				used: 0
			}
		});

		if (record == null) {
			return res.json({
				status: 'error',
				message: 'Token er ikke fundet. Prøv reset password processen igen.'
			});
		}

		var upd = await ResetToken.update(
			{
				used: 1
			},
			{
				where: {
					email: req.body.email
				}
			}
		);

		var newSalt = crypto.randomBytes(64).toString('hex');
		// var newPassword = crypto.pbkdf2Sync(req.body.password1, newSalt, 10000, 64, 'sha512').toString('base64');
		var newPassword = req.body.password1; // Virkelig usikker måde at gemme kodeord. Det er så man kan læse kodeord på test hjemmeside

		await User.update(
			{
				password: newPassword,
				salt: newSalt
			},
			{
				where: {
					email: req.body.email
				}
			}
		);

		return res.json({ status: 'ok', message: 'Kodeord er nulstillet. Benyt det nye kodeord fremover. Gå tilbage til reset side og tryk på Opdater' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
