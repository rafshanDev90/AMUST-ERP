import { getAllCourses, getFeaturedCourses, getCourseBySlug } from '../../services/courses/course.services.js';

/**
 * GET /api/v1/courses
 * Public catalog access with filters
 */
export const getCourses = async (req, res) => {
  try {
    const result = await getAllCourses(req.query);
    
    return res.status(200).json({
      success: true,
      count: result.courses.length,
      pagination: {
        totalCourses: result.total,
        currentPage: result.page,
        totalPages: result.pages
      },
      data: result.courses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error fetching course catalog',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/courses/featured
 * Top popular items banner endpoint
 */
export const getFeatured = async (req, res) => {
  try {
    const featured = await getFeaturedCourses();
    return res.status(200).json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error fetching featured courses',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/courses/:slug
 * Single course profile layout
 */
export const getCourseDetails = async (req, res) => {
  try {
    const course = await getCourseBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: 'Server Error fetching course details',
      error: error.message
    });
  }
};
