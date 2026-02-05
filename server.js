const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const morgan = require("morgan")
const session = require("express-session");
const methodOverride = require("method-override");

const authController = require("./controllers/authController.js");
const todoController = require("./controllers/todoController.js");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");


app.use(express.static("public"))
app.use(express.urlencoded({ extended: false}));
app.use(morgan("dev"))
app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.use(
    session({
        secret: process.env.SESSION_SECRET || "apex-secret-key",
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false,
            maxAge: 24 * 60 * 60 *1000
         }
    })
);
app.use(passUserToView)

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
})

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/apex-todo");
        console.log("✅ connected to Database")
    } catch (error){
        console.log("❌ Error Occurred", error)
    }
}
connectToDB()
app.get("/", (req, res) =>{
    res.render("home");
});
app.use("/auth", authController)
app.get("/test-tasks", (req,res) =>{
    console.log("✅ Test route accessed");
    res.send(`
         <!DOCTYPE html>
        <html>
        <head><title>Test</title></head>
        <body style="padding: 20px;">
            <h1>✅ TEST PAGE WORKS!</h1>
            <p>Server is running correctly.</p>
            <p><a href="/tasks">Go to /tasks (requires login)</a></p>
            <p><a href="/auth/sign-in">Sign In</a></p>
        </body>
        </html>
    `);
});

const protectedRouter = express.Router();
protectedRouter.use(isSignedIn);
protectedRouter.use("/", todoController);
app.use("/", protectedRouter);

app.get("/debug", (req, res) =>{
    console.log("Session ID:", req.sessionID);
    console.log("Session user:", req.session.user);
    res.json({
        sessionID: req.sessionID,
        user: req.session.user ||  "No user",
        loggedIn: !!req.session.user
    });
});

app.listen(3000,()=>{
    console.log('App is working')
})