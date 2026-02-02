# DevBridge Backend Integration Guide

This document outlines the frontend structure of **DevBridge** (formerly ReqForge) to assist in connecting the backend logic.

## 1. System Overview
**DevBridge** is an AI-powered architecture tool that translates raw requirements into technical specifications.
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion.
- **Current State**: Visual Mock Mode.

## 2. Key Integration Points

### A. Main Controller (`src/app/page.tsx`)
This is the parent component that manages state.
- **Input State**: Receives string input from `RequirementInput`.
- **Output State**: Passes structured data to `AIOutput`.
- **Loading State**: Manages `loading` boolean during API calls.

**Backend Action Needed**:
- Replace the `setTimeout` simulation in `handleGenerate` with a real API call to your backend agent.
- API Response must match the `AIOutput` data structure (see below).

### B. Input Parameter (`src/components/RequirementInput.tsx`)
- **Component**: `RequirementInput`
- **Prop**: `onGenerate(req: string)`
- **Description**: The user types a requirement prompt here. When "COMPILE SPECS" is clicked, it triggers the callback with the raw string.

### C. Output Display (`src/components/AIOutput.tsx`)
- **Component**: `AIOutput`
- **Props**: `loading` (boolean), `data` (Object | null)
- **Target Data Structure**:
  The backend **MUST** return a JSON object with strictly defined keys to map correctly to the UI sections:

  ```json
  {
    "stories": [
      "As a user, I want...",
      "As a admin, I want..."
    ],
    "apis": [
      { "method": "POST", "endpoint": "/auth/login" },
      { "method": "GET", "endpoint": "/user/profile" }
    ],
    "edge_cases": [
      { "type": "WARN", "desc": "Rate limiting missing" },
      { "type": "PERF", "desc": "Database indexing required" }
    ]
  }
  ```
  *(Note: You will need to update `AIOutput.tsx` execution logic to map these specific JSON keys if they differ from the current mock implementation)*.

### D. History / Recents (`src/components/Sidebar.tsx`)
- **Component**: `Sidebar`
- **Current State**: Hardcoded array `["Payment Gateway Flow", "User Dashboard", ...]`.
- **Backend Action Needed**:
  - Fetch list of saved sessions/chats from the database.
  - Map them to the `Recents` list in the sidebar.
  - Add `onClick` handler to load previous context.

## 3. UI/UX Considerations
- **Loading Screen**: The app has a 3.6s cinematic loading screen (`src/components/LoadingScreen.tsx`) on initial mount.
- **Theme**: The application strictly uses `#08CB00` (Neon Green) and `#000000` (Black). Do not introduce new colors without updating the Tailwind config.

## 4. File Structure Summary
```
src/
├── app/
│   └── page.tsx            <-- Main Logic / API integration point
├── components/
│   ├── AIOutput.tsx        <-- Renders the AI response (Terminal style)
│   ├── RequirementInput.tsx <-- Captures user prompt
│   ├── Sidebar.tsx         <-- Displays History/Recents
│   ├── LoadingScreen.tsx   <-- Intro Animation
│   └── NeuralBackground.tsx <-- Canvas Particle Layout
```
