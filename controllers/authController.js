const express = require("express")
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
    res.render("auth/signup");
});

router.post("/sign-up", async (req, res)=> {
    console.log("=== SIGN-UP ATTEMPT ===");
    try{
        const { username, email, password } = req.body;
        const user = await User.create({
             username,
             email,
             password
        });
        
        console.log("✅ User created:", user.username);
        req.session.user = { 
            _id: user._id, 
            username: user.username, 
            email: user.email 
        };
        
        
        req.session.save((err) => {
            if (err) {
                console.log("❌ Session save error:", err);
                return res.redirect("/auth/sign-up");
            }
            console.log("✅ Session saved, redirecting to /tasks");
            res.redirect("/tasks");
        });
    } catch (error){
        console.log("❌ Sign-up error:", error);
        res.redirect("/auth/sign-up");
    }
});

router.get("/sign-in", (req, res) =>{
    res.render("auth/signin"); 
});


router.post("/sign-in", async (req, res) =>{
    console.log("=== SIGN-IN ATTEMPT ===");
    console.log("Email:", req.body.email);
    
    try{
        const{email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.redirect("/auth/sign-in");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.redirect("/auth/sign-in");
        }

        console.log("✅ User authenticated:", user.username);
        req.session.user = {
            _id: user._id,
            username: user.username, 
            email: user.email
        };
        
        
        req.session.save((err) => {
            if (err) {
                console.log("❌ Session save error:", err);
                return res.redirect("/auth/sign-in");
            }
            console.log("✅ Session saved, redirecting to /tasks");
            res.redirect("/tasks");
        });
    } catch(error) {
        console.log("❌ Sign-in error:", error);
        res.redirect("/auth/sign-in");
    }     
});

router.get("/logout",(req, res) =>{
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;