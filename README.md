# 🗳️ D-Voting – Secure Online Voting System

## 📌 Overview

D-Voting is a secure and role-based online voting platform developed to conduct transparent, authenticated, and efficient digital elections. The system allows organizations to create and manage elections while enabling students to participate in elections securely using unique election codes and identity verification.

The project focuses on:

* Secure authentication
* One-person-one-vote enforcement
* Role-based access control
* Real-time election management
* Clean and modern user experience

This project was built using React, Supabase, PostgreSQL, and Tailwind CSS.

---

# 🚀 Features

## 🔐 Authentication System

* Email & Password Authentication
* Google OAuth Login
* Role-based authentication
* Secure session management
* Persistent login sessions

---

## 👥 Role-Based Portals

### 🎓 Student Portal

Students can:

* Login securely
* Enter election codes
* Verify identity
* View election candidates
* Vote securely
* Receive voting confirmation
* Prevent duplicate voting

---

### 🏢 Organizer Portal

Organizations can:

* Create elections
* Add candidates dynamically
* Manage election duration
* Generate election codes
* Monitor elections
* View results and statistics
* Track participant count

---

# 🧠 Core Functionalities

## ✅ Election Management

* Create elections with title and timing
* Automatic categorization:

  * Upcoming
  * Active
  * Past
* Real-time dashboard updates

---

## ✅ Candidate Management

* Add multiple candidates
* Candidate details:

  * Name
  * Position
  * Description
  * Optional image
* Dynamic candidate rows
* Organized candidate listing UI

---

## ✅ Voting System

* Unique election code verification
* Candidate selection interface
* Vote submission system
* One-time voting restriction
* Secure database vote storage

---

## ✅ Result Tracking

* Real-time vote counts
* Candidate participation count
* Total votes overview
* Election analytics dashboard

---

# 🔒 Security Features

The project includes multiple security measures:

* Secure authentication using Supabase Auth
* Role verification through database
* Unique election code validation
* Protected routes
* Session-based authentication
* Database-level vote restrictions
* Duplicate vote prevention

---

# 🗂️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Vite

---

## Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication

---

## Authentication

* Email/Password Authentication
* Google OAuth

---

# 📁 Project Structure

```bash
=======
🗳️ Secure Voting System (D-Voting)

A secure, role-based online voting web application built using React, Supabase, and modern web security principles, designed to enable organizations to conduct transparent digital elections and allow students to participate through a highly verified and controlled voting process.

🚀 Project Overview

The Secure Voting System is a full-stack web platform that provides:

Role-based authentication

Secure election creation

Verified student voting

Real-time vote tracking

Prevention of duplicate or unauthorized voting

This system is suitable for:

College elections

Departmental voting

Organization-level polls

Academic project demonstrations

🎯 Core Objectives

Ensure one person → one vote

Maintain voter anonymity

Prevent vote tampering

Provide real-time election visibility

Enforce strict role-based access control

👥 User Roles
🏢 Organizer (Organization Portal)

Create elections

Define election duration

Generate unique election codes

Add and manage candidates

Monitor real-time voting activity

View final election results

🎓 Student (Student Portal)

Login securely

Enter valid election code

Complete identity verification

Vote for a candidate

Restricted to voting only once per election

🔐 Authentication System

The platform uses Supabase Authentication with:

Email & password login

Google OAuth login

Secure session handling

Database-linked role assignment

Authentication flow:

Select Role → Login → Verify Identity → Access Portal

🧠 Security Architecture

The system implements multiple security layers:

Supabase Auth (JWT-based authentication)

Role verification via database

Election code validation

UID-based student verification

One-vote enforcement using database constraints

Time-locked elections (start & end control)

🗂️ Technology Stack
Frontend

React (Vite)

React Router DOM

Tailwind CSS

Modern component-based UI

Backend

Supabase

Authentication

PostgreSQL database

Row Level Security (RLS)

Database

PostgreSQL (Supabase)

🧱 Project Structure
frontend/
│
├── public/
│   └── logo.png
│
├── src/
=======
│   ├── services/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── organization/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateElection.jsx
│   │   │   ├── AddCandidates.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   └── student/
│   │       ├── EnterElection.jsx
│   │       ├── VerifyStudent.jsx
│   │       ├── Vote.jsx
│   │       └── VoteSuccess.jsx
│   ├── services/
│   │   └── supabaseClient.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── vite.config.js

# 🗄️ Database Schema

## 1️⃣ user_profiles

Stores authenticated user information.

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| email      | TEXT      |
| role       | TEXT      |
| created_at | TIMESTAMP |

---

## 2️⃣ elections

Stores election information.

| Column          | Description          |
| --------------- | -------------------- |
| title           | Election name        |
| description     | Election details     |
| election_code   | Unique election code |
| start_time      | Election start       |
| end_time        | Election end         |
| organization_id | Organizer ID         |

---

## 3️⃣ candidates

Stores election candidates.

| Column      | Description      |
| ----------- | ---------------- |
| election_id | Linked election  |
| name        | Candidate name   |
| position    | Candidate role   |
| description | Optional details |
| photo_url   | Candidate image  |

---

## 4️⃣ votes

Stores submitted votes.

| Column       | Description        |
| ------------ | ------------------ |
| election_id  | Linked election    |
| candidate_id | Selected candidate |
| student_uid  | Student identifier |

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/d-voting.git
```

---

## 2️⃣ Navigate to Frontend

```bash
cd d-voting/frontend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 5️⃣ Start Development Server

```bash
npm run dev
```

---

# 🔄 Authentication Flow

```text
Select Portal
     ↓
Login / Google OAuth
     ↓
Role Verification
     ↓
Redirect to Dashboard
```

---

# 🧭 Application Flow

## Organizer Flow

```text
Login
  ↓
Dashboard
  ↓
Create Election
  ↓
Add Candidates
  ↓
Publish Election
  ↓
View Results
```

---

## Student Flow

```text
Login
  ↓
Enter Election Code
  ↓
Verify Identity
  ↓
Select Candidate
  ↓
Vote Successfully
```

---

# 🎨 User Interface Highlights

* Modern responsive UI
* Gradient-based design
* Role-based portal selection
* Professional authentication screen
* Interactive candidate selection
* Real-time dashboard cards
* Mobile-friendly layout

---

# 📊 Dashboard Features

## Organizer Dashboard

* Upcoming elections count
* Active elections count
* Past elections count
* Election activity cards
* Result navigation

---

## Student Dashboard

* Student profile section
* Election code entry system
* Voting instructions
* Secure candidate selection

---

# 🔥 Major Highlights

* Role-based architecture
* Secure voting logic
* Modern frontend design
* Real-time database integration
* Google OAuth authentication
* One-vote restriction system
* Dynamic election lifecycle management

---

# 🧪 Testing Scenarios

The system supports testing for:

* Election creation
* Candidate insertion
* Duplicate vote prevention
* Authentication flow
* Google login
* Election code validation
* Vote counting
* Session persistence

---

# 🌐 Future Enhancements

Future improvements planned:

* Blockchain vote verification
* OTP-based verification
* AI-powered fraud detection
* Face verification system
* Mobile application support
* Advanced analytics dashboard
* Admin control panel
* Multi-language support

---

# 📸 Screens Included

The application includes:

* Login page
* Role selection UI
* Organizer dashboard
* Election creation form
* Candidate management page
* Student voting portal
* Results dashboard

---

# ⚠️ Disclaimer

This project is developed for educational and demonstration purposes. It is not intended for official governmental elections.

---

# 👨‍💻 Developer

## Pandaa

Full Stack Developer & Engineering Student

Technologies Used:

* React
* Supabase
* PostgreSQL
* Tailwind CSS
* JavaScript

---

# ⭐ GitHub Repository

If you found this project useful, consider giving it a star ⭐

---

# 📄 License

This project is licensed under the MIT License.
=======

🗄️ Database Tables
user_profiles

Stores user identity and role.

Column	Type
id	UUID (auth.users)
email	text
role	student / organization
created_at	timestamp
elections

Stores election details.

Column	Description
title	Election name
start_time	Election start
end_time	Election close
election_code	Unique code
organization_id	Organizer
candidates

Stores election candidates.

Column	Description
election_id	Linked election
name	Candidate name
description	Optional
photo_url	Optional
votes

Stores voting records.

Column	Description
election_id	Election
candidate_id	Selected candidate
student_uid	Unique student ID

Unique constraint prevents duplicate voting.

⚙️ Installation & Setup
1️⃣ Clone repository
git clone https://github.com/your-username/d-voting.git
cd d-voting/frontend

2️⃣ Install dependencies
npm install

3️⃣ Configure environment

Create .env file:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run application
npm run dev


Open:

http://localhost:5173

🧪 Testing Flow

Organizer creates election

Election code generated

Student enters election code

Student verifies identity

Student votes

System blocks repeat voting

Organizer views live results

🎨 UI Highlights

Clean modern interface

Role-based portal design

Responsive layout

Accessible forms

Clear voting instructions

Visual feedback after voting

📌 Key Features

✅ Role-based login

✅ Google OAuth support

✅ Secure election codes

✅ Time-restricted voting

✅ One-vote enforcement

✅ Real-time result tracking

✅ Clean professional UI

🔮 Future Enhancements

OTP verification

Aadhaar/UID integration (simulation)

Face verification (demo level)

Blockchain-based vote ledger

Admin analytics dashboard

Mobile app version

Notification system

⚠️ Disclaimer

This project is developed for educational and demonstration purposes.
It is not intended for use in governmental or legally binding elections.

👨‍💻 Developer
Mani Prakash Rao
Engineering Student
Full-Stack Web Development Project

⭐ Acknowledgements

Supabase Team

React Community

Open-source contributors

📄 License

This project is licensed under the MIT License.