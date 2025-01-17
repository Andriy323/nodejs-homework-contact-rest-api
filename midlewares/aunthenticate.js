const jwt = require('jsonwebtoken')
const {SECRET_KEY} = process.env
const  {HttpError}  = require("../helpers");
const { User } = require("../shema/shema-user");

const aunthenticate = async (req ,res,next) => {
const {authorization} = req.headers
const [bearer, token] = authorization.split(" ")
if(bearer !== "Bearer"){
    next(HttpError(401))
}
try {
    const {id} = jwt.verify(token, SECRET_KEY)
    const user = await User.findById(id)
    if(!user || !user.token){
       return next(HttpError(401))
    }
    req.user = user
    next()
} catch  {
    next(HttpError(401))
}
}

module.exports = aunthenticate