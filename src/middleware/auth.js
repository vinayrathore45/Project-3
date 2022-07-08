 const jwt = require ('jsonwebtoken')


const authentication = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ msg: "please provide token" })

        jwt.verify(token, "Books-Management", (err, user) => {
            if (err) { return res.status(403).send("failed authenticaton") };
            req.userlogedin = user;
            //console.log("newconcept",author)
            next()

        })
    }
    catch (err) {
        return res.status(500).send(err.message)
    }
}

module.exports.authentication = authentication;
