const express = require('express');
const router = express.Router();
const User= require('../models/User')
const { body, validationResult } = require('express-validator');


router.post('/',[
body('email',"Enter a Valid Email").isEmail(),
body('name',"Enter a Valid Name").isLength({ min: 3 }),
body('password',"Pasword Must be atleast 5 chracters").isLength({ min: 5 }),
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
      }).then(user => res.json(user))
      .catch(err=> {console.log(err)
    res.json({error:'Please Enter a Unique Value for email',message:err.message})
    })

})

module.exports= router