import express from 'express'
import { getAllJobs, getmyJobs, postJob,updateJob,deleteJob, getSinglejob} from '../controllers/jobController.js'
import {isAuthorized} from '../middlewares/auth.js'
const router = express.Router()

router.get('/getall', getAllJobs)
router.post('/post',isAuthorized,postJob)
router.get("/getmyjobs", isAuthorized, getmyJobs);
router.put('/updateJob/:id',isAuthorized,updateJob)
router.delete('/delete/:id',isAuthorized,deleteJob)
router.get('/:id',isAuthorized,getSinglejob)

export default router;