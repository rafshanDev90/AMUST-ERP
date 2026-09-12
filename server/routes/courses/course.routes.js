import express from 'express';
import { getCourses, getFeatured, getCourseDetails } from '../../controller/course/course.controller.js';
import { addCourse, editCourse } from '../../controller/course/admincourse.controller.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/featured', getFeatured);
router.get('/:slug', getCourseDetails);


router.post('/', addCourse);
router.put('/:slug', editCourse);

export default router;