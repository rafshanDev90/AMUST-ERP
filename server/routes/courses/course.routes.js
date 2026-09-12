import express from 'express';
import { getCourses, getFeatured, getCourseDetails } from '../../controller/course/course.controller.js';
import { addCourse, editCourse } from '../../controller/course/admincourse.controller.js';
import { protect, authorize } from '../../middleware/clerkAuth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/featured', getFeatured);
router.get('/:slug', getCourseDetails);

router.post('/', protect, authorize('teacher', 'admin'), addCourse);
router.put('/:slug', protect, authorize('teacher', 'admin'), editCourse);

export default router;