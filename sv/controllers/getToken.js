

const isEmpty = (data) => {
    return data === null;
}


const getToken = (req, res, next) => {
    var code = req.query.code || null;

    if (isEmpty(code)){
        res.send('Spotify code is empty.');
        res.end();
    }
    var data = {
        url: TOKEN_URI,
        form: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        json: true
    };

    request.post(data, (error, response, body) => {
        if (error && response.statusCode !== 200) {
            res.send("there has been an access token error: " + error);
        }
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        request.post({
            url: 'http://localhost:3000/spoty/getProfile',
            form: {
                access_token: access_token,
                refresh_token: refresh_token
            },
            json: true
        }, (error, response, body) => {
            res.send(body);
        });
    });
}


module.exports = getToken;