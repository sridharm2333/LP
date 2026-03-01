# Lonely Penguin 🐧

A safe emotional support platform for people dealing with loneliness, heartbreak, grief, and emotional pain.

## Stack

- **Mobile:** React Native (Expo) + TypeScript
- **Backend:** Node.js (Express) + TypeScript
- **Database:** MongoDB
- **Auth:** JWT
- **Design:** Clean architecture, modular services, safety-first

## Repositories

- **Backend:** `./backend`
- **Mobile:** `./mobile`

## Core Features

1. Emotional posting (text + emotion tags, optional anonymous)
2. Supportive commenting (Warmth reactions, empathy templates, tone-check stub)
3. Penguin Companion (check-ins, encouragement, streaks)
4. Journey Timeline (chronological posts, mood emoji scale)
5. Community Groups (topic-based: heartbreak, grief, loneliness)
6. Penguin Circle (distress detection, consent-based support circle, 24h dissolve)
7. Safety & moderation (content rules, reporting, crisis keywords → grounding)
8. Kindness Score (points for supportive comments → Circle eligibility)
9. Midnight Ocean Mode (night theme + ocean sounds)
10. Ethical monetization stubs (customization, Calm Packs, Book of Becoming)

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env   # set MONGODB_URI, JWT_SECRET
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## Safety

- No images in posts
- AI moderation endpoints stubbed for integration
- Crisis keyword detection triggers grounding messages
- Penguin Circle uses kindness scores and consent
