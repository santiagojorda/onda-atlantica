


const getProfile = (req, res, next) => {
    var access_token = req.body.access_token,
        refresh_token = req.body.refresh_token;
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
  

module.exports = getProfile;