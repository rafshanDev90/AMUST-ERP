Here is the comprehensive API documentation for your student platform features, organized clearly by feature module with routes, HTTP methods, request bodies, and expected JSON responses.
## POST /api/v1/courses

* 
* Method: POST
* Description: Add a new course to the system.
* Request Body:

{
  "course_name": "Introduction to Computer Science",
  "course_code": "CS101",
  "professor": "Dr. Smith",
  "credits": 4
}

* Returns (201 Created):

{
  "status": "success",
  "message": "Course created successfully.",
  "data": {
    "course_id": "crs_98765",
    "course_name": "Introduction to Computer Science",
    "course_code": "CS101",
    "professor": "Dr. Smith",
    "credits": 4,
    "created_at": "2026-09-07T22:12:00Z"
  }
}

* 

## PUT /api/v1/courses/{course_id}

* 
* Method: PUT
* Description: Edit details of an existing course.
* Request Body:

{
  "professor": "Dr. Alan Turing",
  "credits": 4
}

* Returns (200 OK):

{
  "status": "success",
  "message": "Course updated successfully.",
  "data": {
    "course_id": "crs_98765",
    "course_name": "Introduction to Computer Science",
    "course_code": "CS101",
    "professor": "Dr. Alan Turing",
    "credits": 4,
    "updated_at": "2026-09-07T22:15:00Z"
  }
}

* 

## GET /api/v1/schedules/timetable

* 
* Method: GET
* Description: View the weekly class timetable.
* Returns (200 OK):

{
  "status": "success",
  "data": {
    "weekly_schedule": {
      "Monday": [
        {
          "course_code": "CS101",
          "start_time": "09:00",
          "end_time": "10:30",
          "room": "Hall A"
        }
      ],
      "Wednesday": [
        {
          "course_code": "CS101",
          "start_time": "09:00",
          "end_time": "10:30",
          "room": "Hall A"
        }
      ]
    }
  }
}

* 

## GET /api/v1/schedules/exams

* 
* Method: GET
* Description: View all upcoming exam dates.
* Returns (200 OK):

{
  "status": "success",
  "data": [
    {
      "exam_id": "exm_1122",
      "course_code": "CS101",
      "exam_type": "Midterm",
      "date": "2026-10-15",
      "start_time": "14:00",
      "location": "Gymnasium Hall"
    }
  ]
}

* 

## POST /api/v1/assignments

* 
* Method: POST
* Description: Log a new upcoming assignment deadline.
* Request Body:

{
  "course_id": "crs_98765",
  "title": "Programming Project 1",
  "due_date": "2026-09-20T23:59:59Z",
  "status": "pending"
}

* Returns (201 Created):

{
  "status": "success",
  "data": {
    "assignment_id": "asg_55443",
    "course_id": "crs_98765",
    "title": "Programming Project 1",
    "due_date": "2026-09-20T23:59:59Z",
    "status": "pending"
  }
}

* 

## PATCH /api/v1/assignments/{assignment_id}/status

* 
* Method: PATCH
* Description: Update the tracking status of an assignment (e.g., pending, in_progress, completed).
* Request Body:

{
  "status": "completed"
}

* Returns (200 OK):

{
  "status": "success",
  "message": "Assignment status updated.",
  "data": {
    "assignment_id": "asg_55443",
    "status": "completed"
  }
}

* 

## POST /api/v1/grades

* 
* Method: POST
* Description: Record marks for an assignment or exam and trigger a fresh GPA calculation.
* Request Body:

{
  "course_id": "crs_98765",
  "assessment_name": "Programming Project 1",
  "marks_obtained": 92.0,
  "total_marks": 100.0,
  "weight_percentage": 20
}

* Returns (201 Created):

{
  "status": "success",
  "message": "Grade recorded successfully.",
  "data": {
    "grade_id": "grd_00112",
    "course_id": "crs_98765",
    "marks_obtained": 92.0,
    "letter_grade": "A",
    "current_calculated_gpa": 3.85
  }
}

* 

## POST /api/v1/documents/upload

* 
* Method: POST
* Description: Upload an academic file (PDF, Word doc) to the user library.
* Content-Type: multipart/form-data
* Request Body (FormData):
* file: (Binary data)
   * folder_name: "Syllabi"
* Returns (201 Created):

{
  "status": "success",
  "data": {
    "document_id": "doc_66778",
    "file_name": "CS101_Syllabus.pdf",
    "file_type": "application/pdf",
    "file_size_bytes": 1048576,
    "folder_name": "Syllabi",
    "storage_url": "https://platform.com"
  }
}

* 

## DELETE /api/v1/documents/{document_id}

* 
* Method: DELETE
* Description: Permanent deletion of a specific file from the library.
* Returns (200 OK):

{
  "status": "success",
  "message": "Document doc_66778 was successfully deleted."
}

* 

## GET /api/v1/documents

* 
* Method: GET
* Description: Fetch and organize all stored files.
* Returns (200 OK):

{
  "status": "success",
  "data": {
    "folders": {
      "Syllabi": [
        {
          "document_id": "doc_66778",
          "file_name": "CS101_Syllabus.pdf",
          "storage_url": "https://platform.com"
        }
      ],
      "Unorganized": []
    }
  }
}

* 

## GET /api/v1/dashboard/summary

* 
* Method: GET
* Description: The centralized quick-glance view aggregate endpoint.
* Returns (200 OK):

{
  "status": "success",
  "data": {
    "today_classes": [
      {
        "course_name": "Introduction to Computer Science",
        "time": "09:00 - 10:30",
        "room": "Hall A"
      }
    ],
    "urgent_deadlines": [
      {
        "assignment_id": "asg_55443",
        "title": "Programming Project 1",
        "due_date": "2026-09-20T23:59:59Z",
        "days_left": 13
      }
    ],
    "recent_grades": [
      {
        "assessment_name": "Quiz 1",
        "course_code": "CS101",
        "score": "88/100"
      }
    ],
    "quick_access_materials": [
      {
        "document_id": "doc_66778",
        "file_name": "CS101_Syllabus.pdf"
      }
    ]
  }
}

* 

## GET /api/v1/analytics/performance

* 
* Method: GET
* Description: Retrieves historical visual chart data trends for study progress and grades.
* Returns (200 OK):

{
  "status": "success",
  "data": {
    "gpa_trend": [
      { "semester": "Fall 2025", "gpa": 3.60 },
      { "semester": "Spring 2026", "gpa": 3.75 },
      { "semester": "Current", "gpa": 3.85 }
    ],
    "completion_rate_percentage": 85.5
  }
}

* 

## POST /api/v1/reminders/settings

* 
* Method: POST
* Description: Turn on/off or configure automated browser push alerts and email timelines.
* Request Body:

{
  "enable_email_alerts": true,
  "enable_browser_notifications": true,
  "alert_advance_days": [1, 3, 7]
}

* Returns (200 OK):

{
  "status": "success",
  "message": "Reminder notification profile updated updated.",
  "data": {
    "enable_email_alerts": true,
    "enable_browser_notifications": true,
    "alert_advance_days": [1, 3, 7]
  }
}

* 

Would you like me to generate a complete downloadable Postman collection JSON file or an OpenAPI/Swagger YAML specification file for these endpoints?

