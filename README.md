# 🔒 Software Requirements Specification (SRS) – Secure MERN Social Media Site

This document outlines the requirements for developing a secure social media application using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 1. Introduction

### 1.1 Purpose
This document defines the **functional, non-functional, and security requirements** for developing a secure social media application. The core system includes user registration, secure authentication, profile editing, posting status updates, and secure logout.

### 1.2 Technology Stack
| Component | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | State management and component architecture. |
| **Styling** | **TailwindCSS** | Responsive and modern UI design. |
| **Backend** | **Node.js, Express.js** | Server-side logic and API implementation. |
| **Database** | **MongoDB** | Data storage (Atlas). |
| **Authentication** | **JWT** | Secure user session management. |
| **Hosting** | **Vercel (frontend and Backend)** | Deployment platforms. |

---

## ✅ 2. Functional Requirements (FRs)

### 2.1 User Management

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-1** | User Signup | Users must create an account using Email, Username, and Password. System must validate unique email/username and **hash passwords** (SR-1). |
| **FR-2** | User Sign-in | Users authenticate via email/username and password. System generates a secure **JWT** (SR-2) on success. |
| **FR-3** | Edit Profile | Users can update their Profile picture, Bio, Name, Username (optional), and Location (optional). |
| **FR-4** | View Profiles | Users can view their own and other users’ profiles. Profile visibility defaults to public. |
| **FR-5** | Logout | Users can log out. On logout, the user's JWT must be invalidated on the client side. |

### 2.2 Social Features

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-6** | Create Status Post | Users can create text-based status posts. Each post must store User ID, Timestamp, and Post content. Optional: image uploads. |
| **FR-7** | View Feed | Users can view posts from other users, ordered newest first. Optional: Infinite scrolling or pagination. |
| **FR-8** | Update/Delete Post | **Authorization enforced:** Only the original author can update or delete a post (SR-3). |

### 2.3 System Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-9** | Database | Store user and post data in MongoDB. |
| **FR-10** | Error Handling | System must return meaningful error messages with standardized API responses (e.g., `{ "success": false, "message": "..." }`). |

---


## 🔐 4. Security Requirements (SRs)

### 4.1 Authentication & Authorization

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-1** | Secure Password Storage | Use **bcrypt** (minimum 10 salt rounds). Never store plaintext passwords. |
| **SR-2** | JWT Security | Use **Access Token** (short-lived: 15–30 mins) and **Refresh Token** (long-lived: 7–30 days). Store Access Token **in-memory** and Refresh Token in an **HttpOnly cookie**. |
| **SR-3** | Role-Based Access Control (RBAC) | Implement authorization checks (e.g., only post author can edit/delete, Admin role optional). |

### 4.2 Input Validation & Sanitization

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-4** | Prevent Injection Attacks | **Validate and sanitize all user inputs** (e.g., using `express-validator`). Specifically prevent **MongoDB NoSQL injections** using appropriate Mongoose packages/techniques. |

### 4.3 API Security

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-5** | Rate Limiting | Implement rate limiting on sensitive endpoints (Login, Signup, Password reset) to mitigate brute-force attacks. |
| **SR-6** | CORS Restrictions | Restrict API access to only allowed frontend domains. |

### 4.4 Session & Token Security

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-8** | Prevent CSRF | Use **CSRF tokens** for sensitive operations (if using cookies) and enforce secure cookie flags: **`HttpOnly`**, **`Secure`**, and **`SameSite=strict`**. |
| **SR-9** | Prevent XSS | **Escape all user-generated content.** Leverage React's automatic XSS protection. Use a sanitizer for any rich text/HTML input. |

### 4.5 Data Protection

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-10** | Data Encryption | Encrypt sensitive data **at rest** and **in transit** (using TLS/HTTPS). Do not log sensitive data (passwords, tokens). |

### 4.6 Logging & Monitoring

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **SR-12** | Audit Logging | Log critical security and operational events: Login attempts, Post creation, Profile changes, Errors, and Warnings. |