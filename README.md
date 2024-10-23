# [Charity Donation App](https://charity-app-mu.vercel.app/)

Full-featured **Charity Donation App** built with **React** and **Firebase**. The app allows users to view charities, make donations (both public and anonymous), track progress toward donation goals, and manage donations. There are user and admin functionalities, making it a comprehensive platform for donation management.

[Live Demo](https://charity-app-mu.vercel.app/)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)

## Features

### 1. User Registration and Authentication
- **Firebase Authentication** is used to allow users to register and log in to the app.
- Users can update their profile, including username, email, and donation goal.

### 2. Anonymous and Non-Anonymous Donations
- Users can make donations to different charities.
- Option to donate **anonymously** or under a username.

### 3. Charity Details Page
- Displays charity description, goal amount, and progress toward that goal.
- Users can see a list of all donations made to the charity, including anonymous donations.

### 4. Real-Time Progress Tracking
- Users can track the progress of their own donation goals using a dynamic **progress bar**.
- Charities have a similar progress bar that updates automatically when new donations are made.

### 5. Admin Dashboard
- Admin users can add new charities, view all donations, and edit charity details.
- Admins can track donation activity, charity goals, and more.

### 6. Firebase Firestore Integration
- Real-time data updates for donations, user profiles, and charity details.
- Donations are securely stored and retrieved using **Firebase Firestore**.

### 7. Responsive Design
- The app is fully responsive and works seamlessly on all device sizes (mobile, tablet, desktop).

### 8. Notifications
- **Toast notifications** using `react-hot-toast` for user actions like successful donations, profile updates, or errors.

## Technologies Used

- **React** - JavaScript library for building user interfaces.
- **Firebase** - Backend services including authentication, Firestore, and real-time data sync.
- **React Router** - For navigation between different pages and dynamic routes.
- **Tailwind CSS** - Utility-first CSS framework for styling the app.
- **React Hot Toast** - Toast notifications for user feedback.
- **Vite** - A faster build tool for frontend development.
