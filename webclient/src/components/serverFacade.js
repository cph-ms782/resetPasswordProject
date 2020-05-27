import { SERVER_URL } from './settings';

const configOauthGetToken = (password) => {
	const headerBody = {
		method: 'POST',
		headers: {
			Authorization: 'Basic YXBwbGljYXRpb246c2VjcmV0',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: JSON.stringify({
			grant_type: password,
			username: 'testUser',
			password: password
		})
	};
	return headerBody;
};
const configUserAddUser = (email, password) => {
	console.log('configUserAddUser ', email, password);
	const headerBody = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			password: password
		})
	};
	return headerBody;
};
const configUserGetUser = (email) => {
	console.log('configUserGetUser ', email);
	const headerBody = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email
		})
	};
	return headerBody;
};
const configUserForgotPassword = (email) => {
	console.log('configUserForgotPassword ', email);
	const headerBody = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email
		})
	};
	return headerBody;
};
const configOauthLogin = () => {
	const doBody = {
		grant_type: 'password',
		username: 'testuser',
		password: 'password'
	};
	console.log('configOauthLogin ');
	const headerBody = {
		method: 'POST',
		headers: {
			Authorization: 'Basic YXBwbGljYXRpb246c2VjcmV0',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(doBody)
	};
	return headerBody;
};
const configOauthRefresh = (refToken) => {
	const doBody = {
		grant_type: 'refresh_token',
		refresh_token: refToken
	};
	console.log('configOauthLogin ');
	const headerBody = {
		method: 'POST',
		headers: {
			Authorization: 'Basic YXBwbGljYXRpb246c2VjcmV0',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(doBody)
	};
	return headerBody;
};
const configOauthClient = () => {
	console.log('configOauthClient ');
	const doBody = {
		grant_type: 'client_credentials'
	};
	// Auth: base64 version af "clientId:clientSecret"
	const headerBody = {
		method: 'POST',
		headers: {
			Authorization: 'Basic Y29uZmlkZW50aWFsQXBwbGljYXRpb246dG9wU2VjcmV0',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(doBody)
	};
	return headerBody;
};
const configOauthAccess = (accessToken) => {
	console.log('configOauthAccess accessToken', accessToken);
	const headerBody = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + accessToken,
			'Content-Type': 'application/json'
		}
	};
	return headerBody;
};

const ServerFacade = () => {
	/**
   * make base64 encoding for authorization
   */

  async function useAccessToken(accessToken) {
	  console.log('useAccessToken', `${SERVER_URL}/oauth`);
	  const config = configOauthAccess(accessToken);
	  console.log('useAccessToken config', config);
	  const res = await fetch(`${SERVER_URL}/oauth`, config).then((res) => res.text());
	  console.log('useAccessToken res', res);
	  return res;
  }
	async function clientCreds() {
		console.log('clientCreds', `${SERVER_URL}/oauth/token`);
		const config = configOauthClient();
		console.log('clientCreds config', config);
		const res = await fetch(`${SERVER_URL}/oauth/token`, config).then((res) => res.json());
		console.log('clientCreds res', res);
		return res;
	}
	async function refresh(refToken) {
		console.log('refresh', `${SERVER_URL}/oauth/token`);
		const config = configOauthRefresh(refToken);
		console.log('refresh config', config);
		const res = await fetch(`${SERVER_URL}/oauth/token`, config).then((res) => res.json());
		console.log('refresh res', res);
		return res;
	}
	async function login() {
		console.log('login', `${SERVER_URL}/oauth/token`);
		const config = configOauthLogin();
		console.log('login config', config);
		const res = await fetch(`${SERVER_URL}/oauth/token`, config).then((res) => res.json());
		console.log('login res', res);
		return res;
	}

	async function addUser(email, password) {
		console.log('addUser ', email, password);
		console.log('URL ', `${SERVER_URL}/user/add-user`);
		const config = configUserAddUser(email, password);
		console.log('addUser config', config);
		console.log('addUser URL config', `${SERVER_URL}/user/add-user`, config);
		const res = await fetch(`${SERVER_URL}/user/add-user`, config).then((res) => res.json());
		console.log('addUser res', res);
		return res;
	}

	async function getUser(email) {
		console.log('getUser ', email);
		const config = configUserAddUser(email);
		const res = await fetch(`${SERVER_URL}/user/get-user`, config).then((res) => res.json());
		console.log('getUser res', res);
		return res;
	}

	async function getUserToken(email) {
		console.log('getUserToken ', email);
		const config = configUserGetUser(email);
		const res = await fetch(`${SERVER_URL}/user/get-user-token`, config).then((res) => res.json());
		console.log('getUserToken res', res);
		return res;
	}

	async function postforgotPassword(email) {
		console.log('postforgotPassword ', email);
		const config = configUserForgotPassword(email);
		const res = await fetch(`${SERVER_URL}/user/forgot-password`, config).then((res) => res.json());
		console.log('postforgotPassword res', res);
		return res;
	}

	return {
		login,
		refresh,
		useAccessToken,
		clientCreds,
		addUser,
		getUser,
		getUserToken,
		postforgotPassword
	};
};

export default ServerFacade();
