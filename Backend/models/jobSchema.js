import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Provide job Title"],
        minLength: [3, "Job Title contians atleast 3 characters"],
        maxLength: [50, "Job Title cannot exceed 50 characters!"],
    },
    description: {
        type: String,
        required: [true, "Please Provide job Description"],
        minLength: [3, "Job description contians atleast 3 characters"],
        maxLength: [50, "Job description cannot exceed 50 characters!"],

    },
    category: {
        type: String,
        required: [true, "Please Provide job category"],
    },
    country: {
        type: String,
        required: [true, "Job Country is required"],
    },
    city: {
        type: String,
        required: [true, "Job city is required"],
    },
    location: {
        type: String,
        required: [true, "Please Provide Exact location"],
        minLength: [10, "Job location contians atleast 50 characters"],
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Fixed Salary must contains atleast 4 digits"],
        maxLength: [9, "Fixed Salary cannot exceed 9 digits"],
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "salaryFrom Salary must contains atleast 4 digits"],
        maxLength: [9, "salaryFrom Salary cannot exceed 9 digits"],
    },
    salaryTo: {
        type: Number,
        minLength: [4, "salaryTo Salary must contains atleast 4 digits"],
        maxLength: [9, "salaryTo Salary cannot exceed 9 digits"],
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy:
    {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    }
});

export const Job = mongoose.model("Job", jobSchema)