function initClient() {
    client = google.accounts.oauth2.initCodeClient({ 
        client_id: CLIENT_ID,
        scope: SCOPES,
        ux_mode: 'redirect',
        redirect_uri: redirect_uri
    });
}

function getAuthCode() {
    if (!client) {
        console.error('Client is not initialized');
        return;
    }
    client.requestCode();
}