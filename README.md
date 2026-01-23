# PX AI-Avatar

**Web-based AI Kiosk Application** that generates personalized avatars and lip-sync videos using state-of-the-art AI models.

## 🌟 Features

This application follows a **Two-Terminal Concept**:

### Terminal 1: Admin / Voice Registry
*   **Purpose**: Register new Voice IDs for use in the app.
*   **Function**: Input a Speaker Name and their corresponding **ElevenLabs Voice ID**.
*   **Storage**: Saves directly to a Supabase Database.
*   **Access**: Add `?terminal=1` to the URL or use the hidden button in the UI.

### Terminal 2: User Kiosk (Main App)
*   **Step 1: Selfie**: User takes a photo via webcam.
*   **Step 2: Design**: User selects Outfit, Setting, and Style.
*   **Step 3: Image Gen**: **Google Gemini 2.5** transforms the selfie into a persona.
*   **Step 4: Voice & Text**: User selects a registered voice (from Terminal 1) and types a message.
*   **Step 5: Video Gen**:
    *   **ElevenLabs** generates the audio.
    *   **Replicate (Wan 2.1)** generates the lip-sync video.
*   **Step 6: Result**: Displays the video and a QR Code for instant download.

---

## 🛠️ Installation & Setup

### Prerequisites
1.  **Node.js** (v18 or higher)
2.  **Supabase Account** (for the database)
3.  **API Keys** for:
    *   Google Gemini (`AIza...`)
    *   ElevenLabs
    *   Replicate

### 1. Clone & Install
```bash
git clone <repository-url>
cd px-ai-avatar
npm install
```

### 2. Environment Configuration
Create a file named `.env.local` in the root directory and add your keys:

```ini
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key_here
VITE_REPLICATE_API_TOKEN=your_replicate_token_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create the voices table
create table voices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  voice_id text not null
);

-- Create the generations history table
create table generations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  voice_id text not null,
  name text not null,
  text_prompt text,
  generated_video_url text, -- Link to final video
  generated_image_url text, -- Link to stylized image
  generated_audio_url text  -- Link to audio file
);

-- Enable Public Access (RLS Policies)
alter table voices enable row level security;
alter table generations enable row level security;

create policy "Public view voices" on voices for select to anon using (true);
create policy "Public insert voices" on voices for insert to anon with check (true);
create policy "Public insert generations" on generations for insert to anon with check (true);
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note about Replicate CORS**: This app includes a proxy configuration in `vite.config.ts` to allow local browsers to communicate with Replicate's API. This is configured for local development (`npm run dev`).

## 📱 Use Cases
*   **Event Booth**: Setup a tablet/screen where guests can create avatars.
*   **Promo**: Allow users to send personalized messages with their digital twin.

---

Powered by **Gemini 2.5**, **ElevenLabs** & **Replicate**.
