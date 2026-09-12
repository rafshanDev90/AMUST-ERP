import Course from '../../models/courses/Course.model.js';
import Category from "../../models/courses/Category.model.js";

/**
 * Fetch courses with advanced search, filtering, and pagination
 */
export const getAllCourses = async (queryParams) => {
  const { search, level, type, tag, page = 1, limit = 10 } = queryParams;
  
  // 1. Build the dynamic database query object
  const query = { status: 'published' }; // Only show published courses to the public

  // Text search (Title or Description)
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by difficulty level
  if (level) {
    query.level = level;
  }

  // Filter by course structure type
  if (type) {
    query.courseType = type;
  }

  // Filter by Category Slug
  if (tag) {
    const category = await Category.findOne({ slug: tag.toLowerCase() });
    if (category) {
      query.tags = category._id;
    } else {
      // If the tag doesn't exist, return empty results early
      return { courses: [], total: 0, page: parseInt(page), pages: 0 };
    }
  }

  // 2. Setup Pagination math
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 3. Execute DB queries simultaneously to save performance time
  const coursesPromise = Course.find(query)
    .populate('instructor', 'name avatarUrl title') // Get teacher name, photo, and title
    .populate('tags', 'name slug')                 // Get full tag details
    .skip(skip)
    .limit(parseInt(limit))
    .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

  const countPromise = Course.countDocuments(query);

  const [courses, total] = await Promise.all([coursesPromise, countPromise]);

  return {
    courses,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

/**
 * Fetch top featured / popular courses for homepage banners
 */
export const getFeaturedCourses = async () => {
  return await Course.find({ isPopular: true, status: 'published' })
    .populate('instructor', 'name avatarUrl title')
    .populate('tags', 'name slug')
    .limit(4);
};

/**
 * Fetch a single course by its unique slug
 */
export const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug, status: 'published' })
    .populate('instructor', 'name avatarUrl title bio')
    .populate('tags', 'name slug');
    
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
};
