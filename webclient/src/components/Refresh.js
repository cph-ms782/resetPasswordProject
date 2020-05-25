import React, { useState, useEffect } from 'react';
import facade from './serverFacade';

const Refresh = () => {
	const [ accessToken, setAccessToken ] = useState('');
	const [ accessTokenExpireDate, setAccessTokenExpireDate ] = useState('');
	const [ oldAccessToken, setOldAccessToken ] = useState('');
	const [ refreshToken, setRefreshToken ] = useState('');
	const [ refreshTokenExpireDate, setRefreshTokenExpireDate ] = useState('');
	const [ oldRefreshToken, setOldRefreshToken ] = useState('');
	const [ status, setStatus ] = useState(false);
	const [ showSecret, setShowSecret ] = useState(false);
	const [ secretData, setSecretData ] = useState('');
	const [ errorText, setErrorText ] = useState('');
	const [ countdown, setCountdown ] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date()
			const expires = new Date(accessTokenExpireDate)
			setCountdown(expires-now)
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [accessTokenExpireDate]);

	const handleLogin = async (event) => {
		event.preventDefault();
		const newToken = await facade.login();
		setAccessToken(newToken.accessToken);
		setRefreshToken(newToken.refreshToken);
		setAccessTokenExpireDate(newToken.accessTokenExpiresAt);
		setRefreshTokenExpireDate(newToken.refreshTokenExpiresAt);
		setStatus(true);
		setErrorText('');
	};
	const handleRefresh = async (event) => {
		event.preventDefault();
		const newToken = await facade.refresh(refreshToken);
		setTimeout(() => {
			setOldAccessToken(accessToken);
			setOldRefreshToken(refreshToken);
			setAccessToken(newToken.accessToken);
			setRefreshToken(newToken.refreshToken);
			setAccessTokenExpireDate(newToken.accessTokenExpiresAt);
			setRefreshTokenExpireDate(newToken.refreshTokenExpiresAt);
			setStatus(true);
		}, 2000);
	};
	const handleUseNewAccessToken = async (event) => {
		event.preventDefault();
		const data = await facade.useAccessToken(accessToken);
		console.log('handleUseNewAccessToken data', data);
		console.log('handleUseNewAccessToken data.message', data.message);
		try {
			const text = JSON.parse(data);
			setShowSecret(false);
			setErrorText(text.message);
			setSecretData('');
			setStatus(false);
		} catch (err) {
			setShowSecret(true);
			setSecretData(data);
			setErrorText('');
		}
	};
	const handleOldNewAccessToken = async (event) => {
		event.preventDefault();
		const data = await facade.useAccessToken(oldAccessToken);
		console.log('handleOldNewAccessToken data', data);
		console.log('handleOldNewAccessToken data.message', data.message);
		try {
			const text = JSON.parse(data);
			setShowSecret(false);
			setErrorText(text.message);
			setSecretData('');
		} catch (err) {
			setShowSecret(true);
			setSecretData(data);
			setErrorText('');
		}
	};

	return (
		<div>
			<h2>Login og refresh for at holde login status</h2>
			<div style={{ fontSize: '9px' }}>
				<p>Tryk "Login", derefter prøv de to "Benyt Access Token" knapper </p>
				<p>Prøv "Refresh", derefter prøv de to knapper igen.</p>
				<p>Access token har her en levetid på 15 sekunder</p>
				<p>Refresh token har en levetid på to uger</p>
			</div>
			<form onSubmit={handleLogin}>
				<input type="submit" value="Login" />
			</form>
			<form onSubmit={handleRefresh}>
				<input type="submit" value="Refresh og vent 2 sekunder" />
			</form>
			<h2>Status:</h2>
			{status ? <p>Logget ind i {Math.floor(countdown/1000)} sekunder</p> : <p>Logget ud</p>}
			{showSecret && <p>{secretData}</p>}
			{errorText && <p>{errorText}</p>}
			<form onSubmit={handleUseNewAccessToken}>
				<input type="submit" value="Benyt Access Token" />
			</form>
			<b>Access Token</b>
			<br />
			{accessToken}
			<br />
			<b>Access Token udløber (UTC tid)</b>
			<br />
			{accessTokenExpireDate}
			<br />
			<b>Refresh Token</b>
			<br />
			{refreshToken}
			<br />
			<b>Refresh Token udløber (UTC tid)</b>
			<br />
			{refreshTokenExpireDate}
			<br />
			<br />
			<form onSubmit={handleOldNewAccessToken}>
				<input type="submit" value="Benyt det gamle Access Token" />
			</form>
			<b>Gammelt Access Token</b>
			<br />
			{oldAccessToken}
			<br />
			<b>Gammelt Refresh Token</b>
			<br />
			{oldRefreshToken}
			<br />
		</div>
	);
};

export default Refresh;
