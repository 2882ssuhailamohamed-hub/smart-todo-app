const express = require("express")
const router = express.Router()
const Todo = require("../models/Todo")

router.get("/tasks", async (req, res) => {
    try{
        if (!req.session.user || !req.session.user._id){
            console.log("No user session, redirecting to sign-in");
            return res.redirect("/auth/sign-in");
        }
        const todos = await Todo.find({ user: req.session.user._id });
        res.render("tasks/index", {
            todos:todos,
            user:req.session.user
         });
    } catch (error) {
        console.log("Tasks error:", error);
        res.redirect("/auth/sign-in");
    }
});
router.get("/tasks/new", (req, res) => {
    res.render("tasks/new", {
        user: req.session.user
    });
});
router.post("/tasks", async (req, res) => {
    try{
        req.body.user = req.session.user._id;
        await Todo.create(req.body);
        res.redirect("/tasks");
    } catch(error){
        console.log(error);
        res.redirect("/tasks/new");
    }
});
router.get("/tasks/:id/edit", async (req, res) => {
    try{
        const todo = await Todo.findById(req.params.id);
        res.render("tasks/edit", {
            todo: todo,
            user:req.session.user
        });
    }
        catch(error){
            console.log(error);
            res.redirect("/tasks");
        }

    
});
router.put("/tasks/:id", async (req, res) => {
    try{
        await Todo.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/tasks");
    } catch(error) {
        console.log(error);
        res.redirect("/tasks");}

});

 router.delete("/tasks/:id", async (req, res) => {

        try{
            await Todo.findByIdAndDelete(req.params.id);
            res.redirect("/tasks"); }
            catch(error){
                console.log(error);
                res.redirect("/tasks")
            }

    });
    module.exports = router;





