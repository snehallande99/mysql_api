
const getDatabaseConnection = require('../db');
const jwt =require('jsonwebtoken')
require('dotenv').config()

const registerController= async(req, res) => {
    const connection = await getDatabaseConnection();
    const { name, email,password,channel } = req.body
    
    try {
        
        if (!name || !email || !password || !channel) {
            res.send({message:"Please fill the complete details"})
        }
        console.log("hoiiiiii");
        const [userRows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
       
        if (userRows.length > 0) {
            return res.status(200).send({ success: false, message: "User already exists" });
        }
        
         connection.query('INSERT INTO user (name, email, password, channel) VALUES (?, ?, ?, ?)', [name, email, password, channel]);
         connection.query('INSERT INTO channel (name) VALUES (?)', [channel]);

        res.status(201).send({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}

async function generateToken(userId) {
    try {
        const connection = await getDatabaseConnection();
        // Generate a new token
        const gToken =await jwt.sign({_id: userId}, process.env.SECRET_KEY);

        // Retrieve the current tokens from the user
        const [rows] = await connection.query('SELECT tokens FROM user WHERE id = ?', [userId]);
        console.log(userId)
        console.log(rows)
        let tokens = rows[0].tokens ? JSON.parse(rows[0].tokens) : [];

        // Append the new token to the existing ones
        tokens.push({ token: gToken });

        // Update the tokens field in the database
        await connection.query('UPDATE user SET tokens = ? WHERE id = ?', [JSON.stringify(tokens), userId]);

        return gToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const loginController=async (req,res)=>{
    const connection = await getDatabaseConnection();
    const {email,password}=req.body
    if(!email||!password)
    {
       return res.send("enter complete details")
    }
    try {
        const [users] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        
        const userdata = users[0];
      
        if (password === userdata.password) 
        { 
            const [channels] = await connection.query('SELECT * FROM channel WHERE name = ?', [userdata.channel]);
            const channelDetail = channels[0];
            const token =await generateToken(userdata.id)
            res.status(200).send({
                success: true,
                message: "Login successful",
                token: token,
                user_id: userdata.id,
                channel_id: channelDetail.id
            });
        } else {
            res.status(401).send("Invalid user details");
        }

    } catch (error) {
        console.log(error)
       res.status(500).send({
        success:false,
        message:"Error in login",
        error
       })
    }
}

module.exports={registerController,loginController}