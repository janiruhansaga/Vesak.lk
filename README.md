# 🪔 Vesak.lk — Digital Vesak Experience 2026

A modern Next.js web app that brings the Sri Lankan Vesak festival to life digitally — featuring a 3D walkable Vesak zone, a real-time Dansal map, an e-card generator, and an interactive exhibition.

## ✨ Features

- **3D Walkable Vesak Zone** — WASD/mouse navigation through a procedurally lit Sri Lankan night scene with WebGL post-processing (Bloom) and Web Audio API ambient sound
- **Digital Dansal Map** — Real-time map (Leaflet + Firebase Firestore) to discover and add Dansal locations across Sri Lanka
- **Vesak E-Card Generator** — Create and download personalized Vesak greeting cards with custom messages
- **Virtual Exhibition** — A curated exhibition of the Virtual Pandal and the Guttila Jataka story

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

## ☁️ Deploy on Vercel

This project is pre-configured for Vercel deployment via `vercel.json`.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/janiruhansaga/Vesak.lk)

### Manual Deployment Steps

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → Import `janiruhansaga/Vesak.lk`
3. In **Environment Variables**, add all six `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local`
4. Click **Deploy**

> [!IMPORTANT]
> The `.env.local` file is gitignored and will NOT be pushed to GitHub. You must manually add the Firebase environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **3D Rendering**: Three.js (custom WebGL engine, no React Three Fiber on this page)
- **Animation**: Framer Motion
- **Map**: React Leaflet + OpenStreetMap
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Fonts**: Outfit (Google Fonts)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Home page
│   ├── exhibition/        # Virtual Pandal exhibition
│   ├── virtual-zone/      # 3D walkable Vesak zone
│   ├── map/               # Dansal map
│   └── e-card/            # E-card generator
├── components/
│   ├── 3d/                # Three.js scene
│   ├── e-card/            # E-card generator UI
│   ├── map/               # Map + add Dansal form
│   └── shared/            # Navbar, AudioController
├── context/               # AuthContext, AudioContext
└── lib/
    └── firebase.ts        # Firebase initialization
```
