import React, { useState, useEffect } from 'react';
import facade from './serverFacade';

const Reset = () => {
	const EMPTY_USER = { email: '', password: '' };
	const EMPTY_TOKEN = { email: '', token: '', expiration: '', used: '' };
	let newUser = { ...EMPTY_USER };
	let newToken = { ...EMPTY_TOKEN };

	const [ user, setUser ] = useState({ ...newUser });
	const [ token, setToken ] = useState({ ...newUser });
	const [ emailSend, setEmailSend ] = useState(false);

	const getUserInfo = async (email) => {
		const getUser = await facade.getUser(email);
		return getUser;
	};

	const getTokenInfo = async (email) => {
		const getToken = await facade.getUserToken(email);
		return getToken;
	};
	const makeSetToken = async (email) => {
		const getToken = await getTokenInfo(email);
		if (getToken != null) {
			const NEW_TOKEN = {
				email: getToken.email,
				token: getToken.token,
				expiration: getToken.expiration,
				used: getToken.used
			};
			setToken({ ...NEW_TOKEN });
		} else {
			setToken({ ...EMPTY_TOKEN });
		}
	};

	const handleChange = (event) => {
		const id = event.target.id;
		// console.log('id: ', id);
		user[id] = event.target.value;
		// console.log('user: ', { ...user });
		setUser({ ...user });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		facade.addUser(user.email, 'test');
		setTimeout(async () => {
			const newuser = await getUserInfo(user.email);
			if (newuser) setUser(newuser);
			const getToken = await getTokenInfo(user.email);
			console.log('handleSubmit getToken', getToken);
			await makeSetToken(user.email);
		}, 2000);
	};
	const handleResetSubmit = async (event) => {
		event.preventDefault();
		await facade.postforgotPassword(user.email);

		const newuser = await getUserInfo(user.email);
		if (newuser) setUser(newuser);
		await makeSetToken(user.email);
		setEmailSend(true);
	};
	const handleUpdateSubmit = async (event) => {
		event.preventDefault();
		console.log('handleUpdateSubmit user.email', user.email);
		await makeSetToken(user.email);
		const newuser = await getUserInfo(user.email);
		if (newuser) setUser(newuser);
		setEmailSend(false);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<br />
				<h1>Reset kodeord</h1>
				<h2>Indtast brugbar email til brug ved reset</h2>
				<h2>Tryk på knapperne i rækkefølge</h2>
				<h2>#3. Opdater kan altid benyttes</h2>
				<h4>OBS: Database bliver lagt ned efter eksamen</h4>
				<label>
					Email<br />
					<input type="text" id="email" value={user.email} onChange={handleChange} />
				</label>
				{/* <label>
					Password (synlig pga test)<br />
					<input type="text" id="password" value={user.password} onChange={handleChange} />
				</label> */}
				<br />
				<br />
				1.
				<br />
				<input type="submit" value="Submit og vent 2 sek" />
			</form>
			<br />
			<div>
				<b>Email:</b> {user.email}
				<br />
				<b>Kodeord:</b> {user.password}
				<br />
				<br />
				<b>Token:</b> {token.token}
				<br />
				<b>Udløbsdato: </b>
				{token.expiration}
				<br />
				<b>Benyttet: </b>
				{token.used}
				<br />
				<br />
				2.{' '}
				<form onSubmit={handleResetSubmit}>
					<input type="submit" value="Reset kodeord" />
				</form>
				{emailSend ? (
					<div>
						<p>
							<b>Email Sendt. Check email adresse.</b>
						</p>
						<p>OBS bemærk token info ovenover</p>
						<p>Tiden er UTC</p>
					</div>
				) : (
					<br />
				)}
				<br />
				3.{' '}
				<form onSubmit={handleUpdateSubmit}>
					<input type="submit" value="Opdater" />
				</form>
			</div>
		</div>
	);
};

export default Reset;
