const mongoose = require("mongoose")
const todoSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: true,
      minlength: 3, 
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength:300,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
    type: Date,
    },
  
  priority: {
    type: String,
    enum:["Low", "Medium", "High"],
    default:"Medium",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  },
  {
    timestamps: true,
  }
)
module.exports = mongoose.model("Todo", todoSchema)



