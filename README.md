# DailyBits Web App

## Problem Statement

Computer science students and interview candidates face significant challenges in structured, efficient coding practice. While existing platforms like LeetCode offer large problem libraries, they lack personalized learning paths tailored to individual skill levels, time constraints, and learning goals. Students often struggle to identify which problems to tackle next, how to progress from basics to advanced concepts, and how to optimize their limited study time. There is a clear need for an intelligent platform that combines curated coding problems with AI-powered study plan generation to help learners maximize their preparation efficiency.

DailyBits is a web-based, AI-powered learning platform that supports coding practice through personalized, structured problem-solving.

## Deployment
The app is deployed and can be accessed here: https://dailybits-web-app.vercel.app/todo

## Objective

Develop an AI-powered coding practice platform that:

- Provides a curated library of Python programming problems spanning various difficulty levels and algorithmic concepts.

- Leverages Google Gemini to generate personalized study plans based on user-specified focus areas, available time, and skill level.

- Enables users to practice problems, compare solutions, and track learning progress.

- Offers administrative tools for problem curation and user management.

- Delivers an accessible platform specifically designed for CS students working to prepare for job applications and technical interviews.

## Sample Use Case

**User**: Jane is a CS Master’s student at NEU actively looking for summer 2026 internships.

**Scenario**: Jane has a 3-hour study block today and wants to focus on dynamic programming, an area where she knows the basics but lacks depth.

**User Journey**:

- Jane logs into DailyBits and navigates to ‘AI Study Assistant’.

- She writes: ‘I want to focus on dynamic programming today, and I have 3 hours of focus time. I know the basics of DP, but haven't really gone into details. Find me some problems that grow in complexity.’

- The AI Study Assistant analyzes her request and generates a personalized study plan, fetching her problems from the curated library:
  - Problem 1 (Easy, 30 min): "Climbing Stairs" - reinforces basic DP recurrence relations

  - Problem 2 (Medium, 45 min): "Coin Change" - introduces unbounded knapsack concepts

  - Problem 3 (Medium, 60 min): "Longest Increasing Subsequence" - explores 2D DP

  - Problem 4 (Hard, 45 min): "Edit Distance" - challenges with multiple subproblems

- Jane works through each problem, viewing problem descriptions and writing down her answer.

- After completing each problem, she clicks 'Show Solution' to compare her answer with the provided solution.

- The system tracks her completion and time spent on each problem.

- At the end of the session, Jane has a clear record of her practice and can see her progress in the DP topic area.

## Scope

- User authentication and profile management system

- AI-powered study plan generator using Gemini API

- Problem library with filters of difficulty and concept
  - Provided solutions written in Python

- Problem workspace with split-panel interface (problem description + answer input)
  - Solution comparison feature (user solution vs. provided solution)

- Admin dashboard for user management (view, delete users)

- Admin tools for problem management (review, publish, delete problems)

- Basic progress tracking (problems completed, time spent, topics covered)

- Free-tier deployment on cloud platform

## Technology for Development

### Frontend:

- React for UI

- Redux Toolkit for state management

### Backend:

- Python with Django framework

- Django REST for API development

- PostgreSQL for database

### LLM Integration:

- Google Gemini API for study plan generation and natural language processing

### Deployment:

- Netlify for front-end deployment

- Supabase for backend deployment

### Others:

- Git/GitHub for version control

- Confluence/Jira for documentation and project management

## External Interface Requirements

### Gemini API Integration:

- Purpose: Generate personalized study plans from natural language user requests

- Interface: RESTful API calls to Google AI Studio

- Data Exchange: JSON requests/responses containing user prompts and AI-generated study plans

- Authentication: API key-based authentication

### Supabase Authentication:

- Purpose: Handle user authentication via Supabase Auth; manage secure session tokens for authenticated users

- Interface: Supabase Auth client SDK on the frontend; backend verifies user identity through email/password credentials stored in business tables

- Data Exchange: The frontend authenticates with Supabase Auth and stores the access token in localStorage. The backend manages user accounts (signup, login) using hashed passwords in the user_auth table.

- Authentication: Email/password authentication managed by the backend with Django's password hashing utilities (make_password / check_password). Supabase Auth handles session tokens on the frontend.

## Functional Requirements

### User Authentication

- Users register with email, password, first name, and last name

- Users log in using email and password

- System maintains user session state across navigation

- Users can log out

### User Management (Admin)

- Admins view all registered users

- Admins delete user accounts

### Problem Management (Admin)

- Admins create new coding problems with title, description, difficulty level, and concept tags

- Admins add Python solutions to problems

- Admins review unpublished problems before making them visible to users

- Admins publish problems

- Admins edit existing problem details

- Admins delete problems from the system

### Problem Browsing and Filtering

- Users view all published problems in list format

- Users filter problems by difficulty level (Easy, Medium, Hard)

- Users filter problems by concept tags (e.g. DP, Array, HashMap, Matrix)

- Users search problems by title or keywords

- System displays problem difficulty and concepts as visual tags

### AI Study Plan Generation

- Users submit natural language requests for study plan generation

- System sends user requests to Gemini API for processing

- AI Assistant generates a sequenced list of 1-10 problems based on:
  - User's specified focus concept(s)

  - Available study time

  - Current skill level

  - Progressive complexity

- System displays the generated study plan with problem title, difficulty, and estimated working time

- Users navigate directly to problems from the study plan

### Problem Solving Workspace

- System displays problem description in left panel

- System provides text input area for user answers in right panel

- Users mark problems as complete

- Users compare their answer with the provided solution

### Progress Tracking

- System displays completion status on problem list

- System tracks problems completed by each user

- Users view their personal dashboard showing:
  - Total problems completed

  - Problems completed by difficulty level

  - Concepts practiced

  - Recent activity (last 3 problems)

## Non-Functional Requirements

### Performance

- Page load time should be reasonable (under 5 seconds)

- AI study plan generation should complete within 15 seconds

- System should handle multiple users practicing simultaneously

### Usability

- User interface should be intuitive and easy to navigate

- Problem workspace should have a clear split-panel layout

- Error messages should be clear and understandable

### Reliability

- User data (accounts, submissions, progress) should be saved properly in the database

- System should handle Gemini API errors gracefully with user-friendly messages

### Security

- Admin functions should only be accessible to admin users

- Gemini API key should be stored as environment variable

### Testing

- Core features (authentication, problem submission, AI plan generation) should be manually tested

- Admin functions should be tested to ensure proper access control

- API endpoints should be tested with sample requests

- Different user scenarios should be tested before deployment

### Maintainability

- Code should be organized and commented

- Database should use Django migrations

### Cost

- Deployment should stay within free tier limits
