import { createNewCourse, updateCourseDetails } from "../../services/courses/admincourse.services.js";

/**
 * POST /api/v1/admin/courses
 * Create Course entry
 */
export const addCourse = async (req, res) => {
  try {
    // req.auth.userId contains the secure Clerk user ID string
    const course = await createNewCourse(req.body, req.auth.userId);

    return res.status(201).json({
      success: true,
      message: 'Course workspace generated successfully',
      data: course
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create course workspace',
      error: error.message
    });
  }
};

/**
 * PUT /api/v1/admin/courses/:id
 * Update Course properties
 */
export const editCourse = async (req, res) => {
  try {
    const userRole = req.auth.sessionClaims?.metadata?.role || 'student';
    
    const updatedCourse = await updateCourseDetails(
      req.params.slug,
      req.body,
      req.auth.userId,
      userRole
    );

    return res.status(200).json({
      success: true,
      message: 'Course updates published successfully',
      data: updatedCourse
    });
  } catch (error) {
    const statusCode = error.message.includes('Unauthorised') ? 403 : 400;
    return res.status(statusCode).json({
      success: false,
      message: 'Failed to complete course update request',
      error: error.message
    });
  }
};
