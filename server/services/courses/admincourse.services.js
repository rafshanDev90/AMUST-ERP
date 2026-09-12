import Course from '../../models/courses/Course.model.js';
import User from '../../models/user.model.js';

import slugify from 'slugify'; // Dynamic URL generator package

/**
 * Create a new course record
 */
export const createNewCourse = async (courseData, clerkUserId) => {
  // 1. Find the local MongoDB User ID using the Clerk User ID string
  const instructorUser = await User.findOne({ clerkId: clerkUserId });
  if (!instructorUser) {
    throw new Error('Instructor profile not found in ERP system');
  }

  // 2. Automated slug generator (turns "AI Basics 101" into "ai-basics-101")
  const generatedSlug = slugify(courseData.title, { lower: true, strict: true });

  // 3. Check for slug collision
  const existingCourse = await Course.findOne({ slug: generatedSlug });
  if (existingCourse) {
    throw new Error('A course with this title or slug already exists');
  }

  // 4. Save into Database
  const newCourse = new Course({
    ...courseData,
    slug: generatedSlug,
    instructor: instructorUser._id // Links the MongoDB Object ID reference
  });

  return await newCourse.save();
};

/**
 * Edit an existing course record
 */
export const updateCourseDetails = async (courseSlug, updateData, clerkUserId, userRole) => {
  // 1. Fetch the course target by slug
  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    throw new Error('Course target not found');
  }

  // 2. Security Check: Teachers can only edit THEIR own courses. Admins can edit anything.
  if (userRole !== 'admin') {
    const instructorUser = await User.findOne({ clerkId: clerkUserId });
    if (!course.instructor.equals(instructorUser?._id)) {
      throw new Error('Unauthorised: You can only modify courses assigned to you');
    }
  }

  // 3. If the title changes, regenerate a clean URL slug
  if (updateData.title) {
    updateData.slug = slugify(updateData.title, { lower: true, strict: true });
  }

  // 4. Execute database update execution
  return await Course.findByIdAndUpdate(
    course._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};
