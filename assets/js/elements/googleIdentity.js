CLIENT_ID = "317641776474-5vjf1sapl5rpf39bq7dn39665co8ucvt.apps.googleusercontent.com";
			SCOPES = "https://www.googleapis.com/auth/calendar";
			API_KEY = "AIzaSyCZ2xUuTiArEk2TnxnB_tZpxyt0gK5KMUM";
			DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
			agendaId = "37fabe836153a47e0be51057b05bbeed550e066cb060b59d93bcfdf164c8690f@group.calendar.google.com";
			redirectUri = "http://localhost:5500/safari.html";

			let client;
			let tokenClient;
			let gisInited = false;
			let gapiInited = false;
			
			function initClient() {
				client = google.accounts.oauth2.initCodeClient({
					client_id: CLIENT_ID,
					scope: SCOPES,
					ux_mode: 'redirect',
					redirect_uri: redirectUri
				});

				checkAuth();
			}

			function getAuthCode() {
				initClient()
				if (!client) {
					console.error('Client is not initialized');
					return;
				}
				client.requestCode();
			}

			function gisLoaded() {
				tokenClient = google.accounts.oauth2.initTokenClient({
					client_id: CLIENT_ID,
					scope: SCOPES,
					callback: 'handleAuthResult',
				});
				gisInited = true;
			}

			function initGapi() {
				gapi.client.init({
					apiKey: API_KEY,
					discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
				}).then(function () {
					console.log('Bibliothèque Google API chargée avec succès');
					gapiInited = true;
				}, function (error) {
					console.error('Erreur lors de l\'initialisation de la bibliothèque Google API :', error);
				});
			}

			function loadGapi() {
				gapi.load('client', () => {
					gapi.client.init({
						apiKey: API_KEY,
						discoveryDocs: [DISCOVERY_DOC]
					}).catch((error) => {
						console.error('Erreur durant le chargement de la bibliothèque Google API client:', error);
					});
				});
				gapiInited = true
			}

			function checkAuth() {
				console.log("gapiInited ", gapiInited, " gisInited ", gisInited)
				return new Promise((resolve, reject) => {
					if (gapiInited && gisInited) {
						tokenClient.callback = (response) => {
							if (response.error) {
								reject(response);
							} else {
								resolve(response);
							}
						};

						if (gapi.client.getToken() === null) {
							tokenClient.requestAccessToken({ prompt: 'consent' });
						} else {
							resolve(gapi.client.getToken());
						}
					} else {
						reject('GAPI or GIS not initialized');
					}
				});
			}

			function handleAuthResult(authResult) {
				if (authResult && authResult.access_token) {
					gapi.client.setToken({ access_token: authResult.access_token });
					document.getElementById('GoogleStatus').innerText = "Connecté à Google";
					updateEvent();
				} else {
					document.getElementById('GoogleStatus').innerText = "Non connecté à Google";
					console.error('Error during authorization:', authResult.error);
				}
			}

			function handleRedirect() {
				const urlParams = new URLSearchParams(window.location.search);
				const code = urlParams.get('code');
				if (code) {
					tokenClient.callback = handleAuthResult;
					tokenClient.requestAccessToken({ code });
				}
			}