# 🚀 Village API SaaS System

## India Location Data REST API

---

## 👨‍💻 Project Details

Project Type:
Full Stack SaaS Application

---

## 📌 Project Overview

This project is a SaaS-based backend system that provides a fast and scalable REST API for India’s hierarchical location data.

The system includes structured data for:

* States
* Districts
* Subdistricts
* Villages

It can be integrated into real-world applications such as:

* E-commerce platforms
* Delivery systems
* Location-based services

---

## 🎯 Objectives

* Build a scalable REST API
* Provide structured hierarchical data
* Implement API key authentication
* Create interactive frontend UI
* Simulate real-world SaaS usage
* Deploy on cloud platforms

---

## ⚙️ Features Implemented

### Backend Features

* REST API Endpoints:

  * /v1/states
  * /v1/districts
  * /v1/subdistricts
  * /v1/villages
* PostgreSQL database integration
* API key authentication system
* Rate limiting for security
* Logging system

---

### Frontend Features

1. Cascading Dropdown UI

* State → District → Subdistrict → Village
* Dynamic API-based loading
* Real-time UI updates

2. Demo Client Form

* Name and Email input
* Village search with autocomplete
* Real-time API integration

3. Admin Panel

* Generate API key
* View API logs

4. Toggle System

* Switch between:

  * Dropdown UI
  * Demo Client
  * Admin Panel

---

## 🛠️ Technologies Used

Backend:

* Node.js
* Express.js
* PostgreSQL

Frontend:

* React.js
* Axios
* Vite

Deployment:

* Render (Backend)
* Vercel (Frontend)

---

## 🧠 Frontend Module Explanation

Dashboard (Dropdown UI):

* Displays hierarchical location selection
* Uses cascading dropdown logic
* Each selection triggers API calls

Demo Client:

* Simulates real-world API usage
* Implements autocomplete search
* Displays village suggestions dynamically

Working Logic:

* React hooks (useState, useEffect) manage state
* Axios handles API requests
* UI updates dynamically based on API responses

---

## 🏗️ Backend Architecture

The backend follows a layered architecture.

Components:

* Express server for routing
* PostgreSQL database
* Middleware for API key validation
* Rate limiter for request control

Flow:

1. Request received from frontend
2. API key validated
3. Query executed on database
4. JSON response returned

---

## 🔄 API Integration Flow

* Frontend sends request using Axios
* API endpoint is called with parameters
* API key is included in headers
* Backend processes the request
* Data is returned and rendered in UI

---

## 🌐 Deployment

* Backend hosted on Render
* Frontend hosted on Vercel

Environment Variables used:

* VITE_API_URL
* VITE_API_KEY

---

## 📚 Project Structure

village-api/
│
├── api/ (Backend code)
├── frontend/ (React frontend)
├── scripts/
├── package.json
├── package-lock.json
├── .gitignore

---

## 🧪 How to Run Locally

1. Clone Repository
   git clone <https://github.com/darsh-work/village-api>
   cd village-api

2. Backend Setup
   cd api
   npm install
   node server.js

3. Frontend Setup
   cd frontend
   npm install
   npm run dev

---

## 📊 Learning Outcomes

* Built scalable REST APIs
* Worked with PostgreSQL database
* Implemented API security
* Developed full stack application
* Deployed on cloud platforms
* Debugged real-world issues

---

## ⚠️ Challenges Faced

* Handling large dataset (lakhs of villages)
* Fixing API response issues
* Managing environment variables
* Debugging frontend-backend integration

---

## 🔮 Future Improvements

* Add pagination
* Implement caching (Redis)
* Improve UI/UX
* Add JWT authentication
* Scale system for production

---

## ✅ Conclusion

This project demonstrates a complete SaaS-based system combining backend APIs, frontend UI, and cloud deployment.

It is scalable, practical, and suitable for real-world applications.
