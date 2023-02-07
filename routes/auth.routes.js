const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User.model')


/* GET home page */
router.get("/", (req, res, next) => {
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
        

router.get('/signIn', async(req, res) => {
    res.render('signIn')
});

router.post('/signIn', async(req, res) => {
    const body = req.body
    try{
        const userFound = await User.findOne({username: body.username})

        if(bcrypt.compareSync(body.password, userFound.password)){
            res.render('profile', {user: userFound})
        } else {
            res.render('signIn', {errorMessage: 'wrong password', body})
        }
    }catch(err) {
        console.error('say:', err)
        res.redirect('signIn')
    }
});



module.exports = router;
