# 🏙️ UrbanPulse: AI-Powered Smart Society & Facility Management Ecosystem

> **College Final-Year Mega Project**  
> An enterprise-grade, AI-driven residential community management platform featuring **Vision AI Repair Verification**, **Smart NLP Complaint Triage**, **Digital QR Visitor Gate-Pass**, and **Multilingual AI Announcements**.

---

## 🌟 Key Highlights & Features

- 👤 **Single-Click Multi-Role Workspace**: Instant profile switching between **Resident**, **Maintenance Technician**, **Security Guard**, and **Admin Committee**.
- 👁️ **Vision AI Repair Verifier**: Deep learning visual feature comparison comparing before & after repair photos to eliminate fraudulent task closures (96%+ verification accuracy).
- 🧠 **NLP Complaint Triage & Priority Scoring**: Real-time classification of complaints (Plumbing, Electrical, Elevator, Civil) with automated SLA window assignment (2h Critical, 12h High, 24h Medium).
- 🚨 **Duplicate Complaint Detection**: Automatic matching of newly reported issues against active tickets to suppress redundant reporting.
- 📱 **Digital Visitor QR Gate-Pass**: Instant pre-approved entry pass generation (`UP-8901`) with QR visual codes for guests and delivery drivers.
- 🌐 **Multilingual AI Broadcast Studio**: Auto-drafting of society notices with instant translation into **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- 🆘 **Emergency SOS Siren System**: Real-time siren dispatcher from residents directly to security guard desk terminals.
- 📊 **Executive Analytics Dashboard**: Resolution velocity stats, department SLA heatmaps, and society maintenance dues tracking.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 + Vite
- **Styling & UI**: Tailwind CSS + Custom Dark/Light Glassmorphism Design System
- **Icons**: Lucide React
- **Animations & FX**: Canvas-Confetti, CSS Keyframe Glows & Pulse Rings
- **AI Services**: Custom Client-side Vision AI & NLP Triage Simulation Engine

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your machine.

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/urbanpulse.git
cd urbanpulse
npm install
```

### 3. Run Development Server
```bash
npx vite --port 3000
```
Open your browser and navigate to: **`http://localhost:3000/`**

### 4. Build for Production
```bash
npx vite build
```

---

## 👥 Role Workflows & Demo Instructions

### 1. Resident Portal
- Click `+ Lodge AI Complaint` to test real-time AI category and priority prediction.
- Generate a visitor entry code under the `Visitor Gate-Pass` tab.
- Change notice language between English, Hindi, and Marathi under `Notice Board`.

### 2. Maintenance Technician Workspace
- Select work order `TICK-101`.
- Click `Load Demo Photo` under Technician Completion Photo Upload.
- Click `Run Vision AI Analysis` to trigger visual feature comparison and auto-resolve verified jobs.

### 3. Security Guard Terminal
- Type entry code `UP-8901` in the QR scanner box and click `Verify`.
- View live visitor check-in logbook and acknowledge emergency SOS alerts.

### 4. Admin Committee Command Center
- View executive KPI cards and department workload heatmaps.
- Use the AI Notice Generator Studio to draft and broadcast society announcements.

---

## 📜 License
This project is open-source under the MIT License.
