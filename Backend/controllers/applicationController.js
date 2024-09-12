import { catchAsyncError } from '../middlewares/catchAsyncErr.js';
import ErrorHandler from '../middlewares/err.js';
import { Application } from '../models/applicationSchema.js';
import { Job } from '../models/jobSchema.js';
import cloudinary from 'cloudinary';

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === 'Employer') {
    return next(new ErrorHandler('Employer not allowed to access this resource.', 400));
  }

  if (!req.files || !req.files.resume) {
    return next(new ErrorHandler('Resume File Required!', 400));
  }

  const { resume } = req.files;
  const allowedFormats = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler('Invalid file type. Please upload a PDF, PNG, JPEG, or WEBP file.', 400));
  }

  const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath, {
    folder: 'applications',
    resource_type: 'auto',
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error('Cloudinary Error:', cloudinaryResponse.error || 'Unknown Cloudinary error');
    return next(new ErrorHandler('Failed to upload Resume to Cloudinary', 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: 'Job Seeker',
  };

  if (!jobId) {
    return next(new ErrorHandler('Job not found!', 404));
  }

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler('Job not found!', 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: 'Employer',
  };

  if (!name || !email || !coverLetter || !phone || !address || !resume) {
    return next(new ErrorHandler('Please fill all fields.', 400));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Application Submitted!',
    application,
  });
});

export const employerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);