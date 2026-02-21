# Healify - AI-Powered Physiotherapy Assistant (Frontend)

## Overview
This is the frontend application for Healify, an AI-powered physiotherapy assistant. The application uses your device's camera to evaluate exercise form in real-time, providing immediate visual feedback and tracking to help users perform physiotherapy exercises correctly and safely.

**Live App (Frontend):** [https://healify-ai-powered-physiotherapy-as.vercel.app/](https://healify-ai-powered-physiotherapy-as.vercel.app/)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Contributions](#contributions)

## Features
- **Real-Time Pose Detection**: Utilizes advanced machine learning models running directly in the browser to track body movements.
- **Exercise Form Evaluation**: Connects with backend ML models to analyze forms and provide corrective feedback.
- **Responsive UI**: Built with a modern, responsive interface using React and Tailwind CSS.
- **State Management**: Robust application state handling with Redux Toolkit.
- **Smooth Animations**: Enhances user experience with fluid transitions using Framer Motion.

## Technologies Used
- **React**: UI library for building component-based interfaces.
- **Vite**: Next-generation frontend tooling for fast development and building.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **MediaPipe Pose**: High-fidelity body pose tracking.
- **TensorFlow.js**: Running machine learning models in the browser.
- **Redux Toolkit**: Predictable state container for JavaScript apps.
- **Framer Motion**: Production-ready motion library for React.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation & Running Locally
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd Healify-AI-Powered-Physiotherapy-Assistant
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## Contributions
*The original Healify repository is private as it contains sensitive code and ongoing work by the team. However, I've created separate public repositories that showcase my specific contributions to the project.*

I was responsible for nearly all development across the project. 

For the **Frontend**, my primary contributions include:
- Designing and developing the complete user interface using React and Tailwind CSS.
- Integrating MediaPipe Pose and TensorFlow.js directly into the browser for real-time video processing and landmark extraction.
- Implementing application state management using Redux Toolkit to handle active exercise states and video tracking.
- Creating fluid UI animations and interactive components using Framer Motion.
- Setting up the Vite build tooling and configuring the development environment.

*(Note: Authentication, RAG (Retrieval-Augmented Generation), and Notifications mechanisms were implemented by other contributors/teams.)*
