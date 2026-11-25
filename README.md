# Skill To Scenario Passport

Yes, **Lovable** is an ideal choice for this hackathon. The concept note states that the building phase uses **"AI Tools,"** meaning AI app builders like Lovable are explicitly encouraged.

Because Lovable generates full-stack React/Tailwind web apps automatically, you only need **two or three supporting tools** to make your Track 1 app (**SkillVerify AI**) fully functional and ready to submit.

### 1. Your Exact Lovable-Centered Tool Stack

* **Frontend & App Builder: [Lovable**](https://lovable.dev)
* **What it does:** Builds the entire user interface, multi-step wizard (Step 1: Qualification Input → Step 2: Scenario Assessment → Step 3: Competency Passport), and responsive layout from natural language prompts.
* **Deployment:** Lovable includes one-click publishing, giving you a live public URL immediately for the November 27 submission form.


* **AI Engine: [Gemini API](https://aistudio.google.com/) (`gemini-2.5-flash`) or Lovable AI**
* **What it does:** Powers the credential translation, generates the 3 practical scenario questions, and grades the user's answers to produce the Competency Passport.
* **How to connect:** You can either use Lovable’s built-in AI integration or connect a free Gemini API key via a Supabase Edge Function so your key stays secure.


* **Backend & Database (Optional): [Supabase**](https://supabase.com)
* **What it does:** Lovable connects natively to Supabase with one click. Use it only if you want to save generated Competency Passports to a database or securely store your AI API key.
* **Hackathon shortcut:** If you want zero backend setup, tell Lovable to store the assessment state in React state / `localStorage` and use a simple client-side input field for the API key (just like a "Demo Mode" toggle).



---

### 2. Other Allowed AI Tools (If You Need Extras)

If you want to polish your submission beyond the app itself, these tools fit seamlessly alongside Lovable:

* **UI Polish / Components:** [v0.dev](https://v0.dev) (if you want to grab specific layout inspiration, though Lovable handles this natively).
* **Demo Video Recording:** [Loom](https://www.loom.com) or [OBS Studio](https://obsproject.com) — great for recording a crisp 2-minute walkthrough of your live Lovable URL.
* **Design / Pitch Deck (if needed):** [Gamma](https://gamma.app) or [Canva](https://www.canva.com) for quick visual slides summarizing your SDG 4 & 8 impact.

---

### 3. Ready-to-Use Lovable Prompt for Track 1

When you open Lovable, paste this prompt to generate your complete Track 1 app on the first try:

> "Build a clean, modern web application called **SkillVerify AI** for the ILO Mini-Hackathon (Track 1: Credential Recognition & Skills Validation for Skilled Refugees). Use a trustworthy blue, white, and slate color palette with clear progress steps.
> Create a 3-step interactive workflow:
> 1. **Step 1: Foreign Qualification & Experience Mapper** — A form where a user enters their claimed profession, country of origin, years of experience, and a summary of their past work (with a 'Load Sample Persona' dropdown featuring a displaced Civil Engineer from Syria and a Nurse from South Sudan). Include a checkbox for 'Physical documents lost/unavailable'. Clicking 'Analyze & Generate Assessment' translates their background into Kenyan/international credential equivalents and generates 3 practical, scenario-based technical questions.
> 2. **Step 2: Practical Competency Assessment** — Displays the 3 scenario-based questions with text areas for the candidate to write how they would handle each real-world work scenario. Clicking 'Evaluate Skills' grades their practical reasoning.
> 3. **Step 3: Verified AI Competency Passport & Bridging Roadmap** — Displays an official-looking digital certificate/report card showing their Verified Competency Level (Emerging, Competent, or Senior), specific validated technical skills, a 30-day bridging/re-certification action plan (aligned with SDGs 4 and 8), and a 'Print / Save as PDF' button.
> 
> 
> Include a 'Demo Mode (Pre-filled AI)' toggle in the top navbar so judges can test the full 3-step flow instantly without needing an API key, plus an option to connect a live Gemini API key."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skill-to-scenario-passport.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/844e262c-33c3-4eb9-812f-d4df36c07c9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
