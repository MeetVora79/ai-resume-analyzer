# ResumeAI — AI Resume Analyzer

ResumeAI is a full-stack AI-powered resume analysis platform built with Next.js. Users can upload their resume PDF, choose a target role, optionally paste a job description, and receive an AI-generated report with ATS score, job match score, skill gaps, missing keywords, strengths, weaknesses, and improvement suggestions.

## Features

- Secure authentication with Clerk
- Protected routes and user-specific data
- Resume PDF upload using UploadThing
- Resume metadata storage in MongoDB Atlas
- AI resume analysis using Gemini API
- ATS score generation
- Resume vs job description match analysis
- Skill gaps and missing job keywords
- AI-generated strengths, weaknesses, and suggestions
- Dashboard with analytics and charts
- Previous analysis history
- Delete resume/report with confirmation dialog
- Toast notifications for better UX
- Responsive and modern UI with Tailwind CSS and shadcn/ui
- PDF report download support

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | JavaScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Authentication | Clerk |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| File Upload | UploadThing |
| AI | Gemini API |
| Charts | Recharts |
| Notifications | Sonner |
| Deployment | Vercel |

## Pages

```txt
/                  Landing page
/sign-in           Clerk sign-in page
/sign-up           Clerk sign-up page
/analyze           Resume upload and analysis form
/report/[id]       AI-generated resume report
/dashboard         User dashboard and report history
```

## Project Workflow

```txt
User signs in
↓
Uploads resume PDF
↓
Adds target role and optional job description
↓
Resume is uploaded to UploadThing
↓
Resume details are saved in MongoDB
↓
Gemini analyzes the resume PDF
↓
Report is saved in MongoDB
↓
User views ATS score, job match score, skills, keywords, and suggestions
```

## Environment Variables

Create a `.env.local` file in the project root and add:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
UPLOADTHING_TOKEN=your_uploadthing_token
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

For production deployment, use Clerk live keys instead of development keys.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

## Main Functional Modules

### Authentication

Clerk is used for login, signup, session management, and protected routes. Each resume and report is linked to the authenticated user's Clerk user ID.

### Resume Upload

UploadThing handles secure PDF upload. After upload completion, the file URL and metadata are saved in MongoDB.

### AI Analysis

Gemini API analyzes the uploaded PDF and returns structured JSON including:

```txt
ATS score
Job match score
Summary
Strengths
Weaknesses
Skill gaps
Recommended keywords
Matching skills
Missing job keywords
Improvement suggestions
Project suggestions
Formatting issues
```

### Dashboard

The dashboard shows:

```txt
Total analyses
Completed reports
Average ATS score
Best ATS score
Recent analyses table
ATS score charts
```

## Folder Structure

```txt
src/
  app/
    api/
      dashboard/
      reports/
      resumes/
      uploadthing/
    analyze/
    dashboard/
    report/[id]/
    sign-in/
    sign-up/
    layout.js
    page.js
  components/
    dashboard/
    report/
    shared/
    ui/
  lib/
    db.js
    gemini.js
    uploadthing.js
  models/
    Resume.js
    Report.js
  proxy.js
```

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/resumes` | POST | Save uploaded resume details |
| `/api/resumes/[id]` | GET | Get single resume for logged-in user |
| `/api/resumes/[id]` | DELETE | Delete resume and related report |
| `/api/reports/generate` | POST | Generate AI report using Gemini |
| `/api/reports/[resumeId]` | GET | Get report by resume ID |
| `/api/dashboard` | GET | Get dashboard stats and recent analyses |
| `/api/uploadthing` | GET/POST | UploadThing file upload route |

## Deployment

This project can be deployed on Vercel.

Deployment checklist:

```txt
Add all environment variables in Vercel
Use Clerk production/live keys
Update NEXT_PUBLIC_APP_URL with deployed URL
Allow production domain in Clerk dashboard
Allow production domain in UploadThing if required
Test login, upload, analysis, dashboard, and report pages
```

## Future Improvements

- Dark/light mode toggle
- Mobile navbar
- Resume improvement rewrite suggestions
- Email report sharing
- Stripe-based premium plan

## Author

Meet Vora

- GitHub: https://github.com/MeetVora79
- LinkedIn: https://linkedin.com/in/meetvora79
- Email: meetvora877@gmail.com
