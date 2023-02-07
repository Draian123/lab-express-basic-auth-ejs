const router = require('express').Router()
const bcrypt = require('bcrypt');
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model')


/* GET home page */
router.get("/",(req, res, next) => {
  res.render("signup");
});

router.post('/', async(req, res)=>{
    try {
        let body = req.body;
        const salt = bcrypt.genSaltSync(12)

        let passwordHash = bcrypt.hashSync(body.password, salt)
        delete body.password
        body.password = passwordHash
        User.create(body)
        res.redirect('/')
        
    }catch(err) {
        console.error(err)
    }})
        

router.get('/signIn', isLoggedOut, async(req, res) => {
    res.render('signIn')
});

router.post('/signIn',isLoggedOut, async(req, res) => {
    const body = req.body
    try{
        const userFound = await User.findOne({username: body.username})

    if(userFound == null){
        throw new Error('User not found')
    }else{
        const userData = {
            username: userFound.username
        }
        req.session.user = userData;

        if(bcrypt.compareSync(body.password, userFound.password)){
            res.redirect('profile')
        } else {
            // res.render('signIn', {errorMessage: 'wrong password', body})
            throw new Error('Invalid password')
        }
    }
    }catch(err) {

        console.error('say:', err)
        res.render('signIn', {body, err})
    }
});

router.get('/profile', isLoggedIn, async(req, res) => {
    const user = req.session.user
    res.render('profile', {user})
});

module.exports = router;
