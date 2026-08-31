const userModel = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async(req, res)=>{
   try {
    const {name , email , password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            message : "Name , email and password are required"
        })
    }

    const existingUser = await userModel.findOne({
        email : email.toLowerCase()
    })

    if(existingUser){
        return res.status(409).json({
            message : "user already registered"
        })
    }
    
    const hashedPassword = await bcrypt.hash(password , 10)

    const user = await userModel.create({
        name , 
        email : email.toLowerCase(),
        password : hashedPassword
    })

    const token = jwt.sign(
           { id: user._id }, 
             process.env.JWT_SECRET, 
            { expiresIn: '7d' }
    )

    res.cookie('token' , token, {
        httpOnly : true,
        sameSite : 'lax',
        secure : process.env.NODE_ENV === 'production',
        maxAge : 7 * 24 * 60 * 60 * 1000
    }) 

    return res.status(201).json({
        message : "registration sucessfull",
        user : {
            id : user._id,
            name : user.name ,
            email : user.email,
        }
    })
   } catch (error) {
     return res.status(500).json({
        message: "registration failed"
     })
   }
}

const login = async(req, res)=>{
    try {
        const {email , password} = req.body

        if(!email , !password){
            return res.status(400).json({
                message : "email and password are required"
            })
        }

        const user = await userModel.findOne({
            email : email.toLowerCase()
        })

        if(!user){
            return res.status(401).json({
                message : "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password)

        if(!isPasswordCorrect){
            return res.status(401).json({
                message : "invalid password"
            })
        }

       
    const token = jwt.sign(
           { id: user._id }, 
             process.env.JWT_SECRET, 
            { expiresIn: '7d' }
    )

        res.cookie("token" , token , {
            httpOnly : true,
            sameSite : 'lax',
            secure : process.env.NODE_ENV === 'production',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message : "user logged in sucessfully",
            user : {
                id: user._id,
                name : user.name,
                email : user.email 
            }
        })
    } catch (error) {
        return res.status(500).json({
            message : "Login failed"
        })
    }
}

const logout = async(req,res)=>{
    res.clearCookie("token")

    return res.json({
        message : "Logout sucessful"
    })
}

module.exports = {
    register , 
    login ,
    logout
}