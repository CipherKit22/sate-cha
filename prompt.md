
### **SateCha – Cybersecurity Awareness Chatbot Website**

> For: APT Young Professionals and Students Programme (APT YPS) 2025
> Project Title: **“Cybersecurity & Privacy Chatbot Development”**
> Hosted by: Myanmar Computer Professionals Association (MCPA)

---

### 🎯 Objective

by referencing the attached images , Build a fully responsive, modern, **AI-powered cybersecurity education platform** with interactive chatbot, gamified quiz system, real-time tools, and downloadable certificates. The entire platform must be fully **bilingual** — supporting both **English and Burmese** UI and content.

---

## 🧭 Pages & Feature Breakdown

---

### 🏠 Home Page

* Hero section: Welcome message and call to action
* Vision & mission cards
* Feature navigation cards:

  * **Dashboard** – Real cyber incident reports
  * **Cyber Quiz Pro** – Interactive tests
  * **Mg Cyber Chatbot** – AI assistant

📝 **Note:** All UI texts must be available in both English and Burmese. Implement a language toggle (EN/MM) stored in user preferences.

---

### 📊 Dashboard

* Real-world scam case studies (short descriptions with sources)
* Daily tips and threat alerts
* Pinned/saved content (per user)
* Visual progress tracker:

  * Quizzes completed
  * Medals earned
  * Certificates issued

---

### 🧠 Cyber Quiz Pro

> Gamified quiz system with medals, ranks, and downloadable certificates.

#### Quiz Modes:

* **Practice Mode** – Learn with instant feedback
* **Challenge Mode** – Timed quiz with scores + certificate
* **Simulation Mode** – Interactive phishing/email test flows

#### Question Types:

* Multiple choice
* Multi-select
* Case-based scenario logic
* Image/Email phishing test
* Drag-and-drop steps

#### Feedback:

* Show explanation per question
* Suggest learning materials or chatbot links

---

### 🏅 Certificate & Medal System

After completing Challenge Mode quizzes, users earn a **digital certificate** with their name, score, medal, rank, and completion date. The certificate must support bilingual text and a print-friendly layout.

#### Medal Criteria:

| Score Range (%) | Medal     | Rank Title        |
| --------------- | --------- | ----------------- |
| 90–100          | 🥇 Gold   | Cyber Guardian    |
| 75–89.99        | 🥈 Silver | Threat Tracker    |
| 60–74.99        | 🥉 Bronze | Security Explorer |
| 45–59.99        | 🏅 Iron   | Digital Learner   |
| Below 45        | 📘 None   | Cyber Trainee     |

Certificates should:

* Be generated as PDF
* Include name, medal, rank, score, date, logos
* Support download and QR verification (optional)
* Display in user profile

---

### 🛠 Cyber Tools Page

Useful interactive tools to improve awareness and digital hygiene:

* Password Strength Checker
* Secure Password Generator
* Phishing Email Scanner
* Suspicious Link Analyzer
* 2FA Setup Guide (for common platforms)

---

### 🤖 Chatbot: **Mg Cyber** (Powered by DeepSeek API)

* Friendly assistant available on all pages via floating icon
* Supports both Burmese and English input
* Trained on key cybersecurity FAQs
* Replies with actionable tips and simplified explanations
* Optional: Audio playback or speech-to-text (future enhancement)

---

### ⚙️ Settings/Profile

* Edit profile (name, email, phone, avatar)
* Change password
* Toggle language preference (EN/MM)
* View earned certificates and medals
* Enable/disable notifications

---

## 📦 Supabase (Backend)

Use Supabase to manage:

* User authentication
* Quiz results and history
* Certificates
* Language preferences
* Saved tips and dashboard data
* Optional: Chat logs for improvement

---

## 🌐 Bilingual Support Instructions

> The website must be fully bilingual in **English and Burmese**.

### Approach:

* Use an i18n system (e.g., JSON-based key translation)
* Language switcher with persistent user preference
* Localize all:

  * Texts, buttons, tooltips
  * Certificate content
  * Chatbot conversation prompts/responses
* Store translation strings as:

```json
{
  "start_quiz": {
    "en": "Start Quiz",
    "mm": "စမ်းသပ်မည်"
  },
  ...
}
```

---