const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");
const todoSchema = new mongoose.schema({
    title: { title: String, required: true },
    description: { type: String },
    completed: { type: Boolean, defuault: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ["Low","Medium","High"], default: "Midum"},
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
module.exports = mongoose.model("Todo", todoSchema);
