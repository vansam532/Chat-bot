# Vedant — Smart Chatbot

**Repository name:** `vedant`  
**Owner:** `vikas_hindu`

Vedant is a lightweight web chatbot starter with a clean chat interface and a Node.js backend. It can use the OpenAI API when an API key is configured. Without a key, it runs in demo mode with simple built-in replies.

## Features
- Responsive chat interface for mobile and desktop
- Demo mode works without an API key
- Optional AI replies through the OpenAI API
- API key stays on the server in `.env` (never put it in frontend code)
- Clear chat button and typing indicator

## Requirements
- Node.js 18 or newer
- Optional: an OpenAI API key for AI-powered replies

## Run locally
1. Install Node.js.
2. Open a terminal in this folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and add your API key if you have one.
5. Start the app:
   ```bash
   npm start
   ```
6. Open `http://localhost:3000`.

## Publish to GitHub
Create a new repository named **`vedant`** under the GitHub account **`vikas_hindu`**, then upload these project files. If Git is installed, you can use:

```bash
git init
git add .
git commit -m "Initial commit: Vedant smart chatbot"
git branch -M main
git remote add origin https://github.com/vikas_hindu/vedant.git
git push -u origin main
```

If GitHub says the repository already exists, create a different repository name or connect to the existing repository carefully.

## Configure AI
In `.env`, set:
```env
OPENAI_API_KEY=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
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```
Use an API model available to your account. Never commit `.env` or share your API key.

## Note
The project is a starter template, not a hosted website. GitHub stores the code; to keep the backend running online, deploy it to a Node.js hosting provider and configure environment variables there.
