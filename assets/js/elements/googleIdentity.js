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

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
}
    // Swal.fire({
    //     title: 'Succès',
    //     html: `L'inscription a été prise en compte.`,
    //     icon: 'success',
    //     confirmButtonText: 'OK',
    // });
