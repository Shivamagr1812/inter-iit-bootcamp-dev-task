const mongoose = require('mongoose');
const userModel = require('../model/userModel');


const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret ="pokemonGoCharizard";


const{validationResult}=require('express-validator');



 const signup = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hashing 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        // Respond with success, user data (excluding password), and token
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};



// router.post('/create-user',
//     body('email').isEmail(),
//     body('name').isLength({min:5}),
//     body('password','please enter 5 character password').isLength({min:5})
    
    
    
//     ,async(req,res)=>{
 

// })






 const login=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json('please enter correct credentials');
        }

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.status(400).json('please enter correct credentials');
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, 'yourSecretKey');          //taking unique value for authToken value
        res.json({ success: true, authToken });
    } catch (error) {
        console.log(error);
        res.status(500).json('fail');
    }
}



module.exports={
    login,
    signup

}


// router.post('/login-user',
//     body('email').isEmail(),
//     body('password', 'please enter 5 character password').isLength({ min: 5 }),
//     async (req, res) => {
       
//     }
// );
