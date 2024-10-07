const jwt = require('jsonwebtoken');

const isAuth = (req,res,next)=>{
// console.log(req.headers);
const token = req.headers?.authorization.split(' ')[1];

const tokenObj = jwt.verify(token,'anykey',(err,decoded)=>{
    console.log(decoded);
    if(err) return false;
else return decoded;

})
if(tokenObj){
    req.user= tokenObj.id;
    console.log(req.user);
    next();
}else{
    const err = new Error('token expired, login unsuccess');
    next(err);
}





}

module.exports=isAuth