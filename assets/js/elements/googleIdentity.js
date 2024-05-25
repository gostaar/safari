//googleIdentity.js
const CLIENT_ID = '317641776474-5vjf1sapl5rpf39bq7dn39665co8ucvt.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const API_KEY = 'AIzaSyCtrR9vgCObA2x3iCMeZbD2RGra3nyFPfU';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const agendaId = "37fabe836153a47e0be51057b05bbeed550e066cb060b59d93bcfdf164c8690f@group.calendar.google.com";

let tokenClient;
			let gapiInited = false;
			let gisInited = false;

window.gapiLoaded = function () {
    gapi.load('client', initializeGapiClient);
};

window.gisLoaded = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // défini plus tard
    });
    gisInited = true;
    maybeEnableButtons();
};

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

window.handleAuthClick = function () {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        // await listUpcomingEvents(); //la fonction se trouve sur safari.html
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
};

window.handleSignoutClick = function () {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
};