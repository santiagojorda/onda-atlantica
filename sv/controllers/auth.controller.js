var request = require('request');

const AUTH_API = 'https://accounts.spotify.com/authorize?',
      CLIENT_ID = '40d2fa449749415f9570c843dee768f6',
      CLIENT_SECRET = '26596c9d788a410d88dce1a3836bff19',
      REDIRECT_URI = 'http://localhost:3000/callback',
      TOKEN_URI = 'https://accounts.spotify.com/api/token',
      USER_URI = 'https://api.spotify.com/v1/me',
      PLAYER_URI = 'https://api.spotify.com/v1/me/player';

const SCOPES_API = 'streaming user-read-email user-read-private'; 

const authCtrl = {};







authCtrl.auth = async (req, res, next) => {
    res.redirect(AUTH_API+
        "client_id="+CLIENT_ID+
        "&response_type=code&redirect_uri="+REDIRECT_URI+
        "&scope="+SCOPES_API);
};


authCtrl.getTokens = async (req, res, next) => {
    var code = req.query.code || null
    var refresh = req.query.refresh || null

    if (code !== null){
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
            res.send(response)
        });
    }
    else if (refresh !== null){
        var data = {
            url: TOKEN_URI,
            form: {
                refresh_token: refresh,
                grant_type: 'refresh_token'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            json: true
        };

        request.post(data, (error, response, body) => {
            res.send(response)
        });
    }

    else 
        res.send('no se encontro ningun parametro en la url')


};

authCtrl.getProfile = async (req, res, next) => {
    var access_token = req.body.access_token;

    var data = {
        url: USER_URI,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };

    request.get(data, (error, response, body)=> {
        if (error && response.statusCode !== 200) {
            res.send("there has been an access profile data error: " + error);
        }
        res.send(body);
    })
}

// authCtrl.getCurrentPlayback = async (req, res, next) => {
//     var access_token = req.body.access_token;

//     var data = {
//         url: PLAYER_URI,
//         form:{
//             grant_type: 'refresh_token'
//         }
//         headers: {
//             'Authorization': 'Bearer ' + access_token,
//         },
//         json: true
//     };

//     request.get(data, (error, response, body)=> {
//         if (error && response.statusCode !== 200) {
//             res.send("there has been an player get data error: " + error);
//         }
//         res.send(body);
//     })
// }
  

module.exports = authCtrl;
