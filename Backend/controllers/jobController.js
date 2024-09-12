import { catchAsyncError } from '../middlewares/catchAsyncErr.js'
import ErrorHandler from '../middlewares/err.js'
import { Job } from '../models/jobSchema.js'
import { sendToken } from '../utils/jwtToken.js'

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false })
  res.status(200).json({
    success: true,
    jobs
  })
})

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role === 'Job Seeker') {
    return next(
      new ErrorHandler(
        'Job Seeker is not allowed to acess this resources!',
        400
      )
    )
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo
  } = req.body
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler('Please Provide full job details!', 400))
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler('Please either provide fixed salary or ranged salary!')
    )
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler('Cannot enter fixed salary and ranged salary together!')
    )
  }
  const postedBy = req.user._id
  const existingJob = await Job.findOne({
    title,
    description,
    location,
    country,
    postedBy,
    city
  })

  if (existingJob) {
    return next(
      new ErrorHandler('Job with similar details already exists!', 409)
    )
  }

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy
  })
  res.status(200).json({
    sucess: true,
    message: 'Job posted successfully!',
    job
  })
})

export const getmyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role == 'Job Seeker') {
    return next(
      new ErrorHandler(
        'Job Seeker is not allowed to acess this resources!',
        400
      )
    )
  }
  const myjobs = await Job.find({
    postedBy: req.user._id
  })
  res.status(200).json({
    sucess: true,
    myjobs
  })
})

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role == 'Job Seeker') {
    return next(
      new ErrorHandler(
        'Job Seeker is not allowed to acess this resources!',
        400
      )
    )
  }
  const { id } = req.params
  let job = await Job.findById(id)
  if (!job) {
    return next(new ErrorHandler('Oops job not found!', 404))
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    sucess: true,
    job,
    message: 'Job Updated SuccessFully!'
  })
})

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role == 'Job Seeker') {
    return next(
      new ErrorHandler(
        'Job Seeker is not allowed to acess this resources!',
        400
      )
    )
  }
  const { id } = req.params
  let job = await Job.findById(id)
  if (!job) {
    return next(new ErrorHandler('Oops job not found!', 404))
  }
  await job.deleteOne()
  res.status(200).json({
    sucess: true,
    message: 'Job Deleted SuccessFully!'
  })
})


export const getSinglejob = catchAsyncError(async(req,res,next)=>{
  const {id} =req.params;
  try{
    const job = await Job.findById(id);
    if(!job){
      return next(new ErrorHandler('Job not found',404));
    }
    res.status(200).json({
      sucess: true,
      job
    })
  }
  catch(error){
    return next(new ErrorHandler('Invalid ID/ Cast Error',400))
  }
})