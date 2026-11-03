# Modern AI Chatbot Using Google Gemini API

A modern, lightweight, fast, and fully responsive AI chatbot powered by the **Google Gemini Free API** with real-time streaming, local storage CRUD persistence, markdown rendering with syntax-highlighted code blocks, and light/dark theme support.

---

## 🚀 Key Features

### 1. Intelligent AI & Streaming Responses
- **Google Gemini Free API**: Server-side integration using the official `@google/genai` TypeScript SDK (`gemini-3.1-flash-lite` and `gemini-3.8-flash`).
- **Real-Time Token Streaming**: Streams responses incrementally using Server-Sent Events (SSE) for near-instant perceived response times.
- **Stop Generating**: Dedicated stop button allows users to cancel streaming mid-generation.
- **Regenerate Response**: Re-run the conversation from the last AI turn with one click.
- **Typing Indicator**: Animated pulsing indicator displays while the AI is preparing tokens.

### 2. Full Local Storage CRUD Operations
- **Create**: Start fresh chats with auto-generated contextual titles or customize them.
- **Read**: Load previous conversations seamlessly grouped by date (*Today*, *Yesterday*, *Previous 7 Days*, *Older*).
- **Update**:
  - Rename conversation titles inline or in the sidebar.
  - Edit previously sent user messages with the option to update and regenerate responses.
- **Delete**:
  - Delete individual messages from any conversation.
  - Delete entire conversations with safety confirmation.
  - Clear all chat history with a confirmation dialog.
- **Search**: Filter conversations and messages by search query instantly.
- **Persistence**: Automatically restores conversations and settings upon browser refresh.

### 3. Rich Markdown & Syntax Highlighting
- **Full Markdown Support**: Headings, lists, tables, blockquotes, bold/italic, and inline code.
- **Syntax Highlighting**: Powered by Prism with support for JavaScript, TypeScript, Python, JSON, Bash, CSS, SQL, and HTML.
- **One-Click Copy**: Copy complete code blocks with visual checkmark feedback, or copy entire message texts.

### 4. Modern UI & UX Design
- **Theme Modes**: Seamless switching between Dark Mode, Light Mode, and System preference.
- **Responsive Layout**: Desktop collapsible sidebar and mobile-friendly slide-over drawer.
- **Welcome Screen**: Engaging starter prompts across coding, architecture, writing, and concepts.
- **Auto-Scroll with Override**: Smoothly scrolls down as new tokens arrive, with a floating "Scroll to bottom" button when scrolling up.
- **AI Persona & Settings**: Customize system instructions and tone presets (e.g. *Senior Software Engineer*, *Concise & Direct*, *Patient Tutor*).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend / Proxy**: Node.js & Express (Full-stack architecture running with Vite middlewares)
- **AI SDK**: `@google/genai` (Server-side only for complete API key security)
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` with error protection
- **Code Highlighting**: PrismJS & `react-markdown` with `remark-gfm`

---

## 📦 Project Structure

```
├── .env.example              # Example environment variable template
├── index.html                # HTML entry point with fonts and metadata
├── metadata.json             # Applet metadata and permissions
├── package.json              # Project dependencies and run scripts
├── server.ts                 # Express server with SSE streaming & Vite middleware
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
└── src/
    ├── App.tsx               # Main application container
    ├── index.css             # Tailwind CSS & syntax highlighting styles
    ├── main.tsx              # React DOM entry point
    ├── components/
    │   ├── ChatHeader.tsx    # Header with title editing, model selector & theme toggle
    │   ├── ChatInput.tsx     # Auto-resizing textarea with Stop / Send controls
    │   ├── ChatMessage.tsx   # Message bubbles with copy, edit, and timestamps
    │   ├── CodeBlock.tsx     # Syntax-highlighted code blocks with copy button
    │   ├── DeleteConfirmModal.tsx # Confirmation dialog for deletions
    │   ├── MarkdownRenderer.tsx   # Markdown parser with custom components
    │   ├── SettingsModal.tsx # Persona and model configuration modal
    │   ├── Sidebar.tsx       # Conversation history, search, and new chat actions
    │   └── WelcomeScreen.tsx # Hero empty-state with starter cards
    ├── hooks/
    │   ├── useChat.ts        # Chat state, CRUD operations, and SSE streaming
    │   └── useTheme.ts       # Light, dark, and system theme manager
    ├── types/
    │   └── chat.ts           # TypeScript interfaces for conversations & messages
    └── utils/
        └── storage.ts        # LocalStorage persistence and title generator
```

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Gemini API Key
Create a `.env` file in the root folder based on `.env.example`:
```bash
cp .env.example .env
```
Add your free Google Gemini API key:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```
> **How to get a key:** You can obtain a free Google Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
> In Google AI Studio Build, the key is automatically injected at runtime.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚀 Deploying to Vercel

This app is pre-configured for one-click deployment on **Vercel** with dedicated Serverless Functions in `/api` and `vercel.json` routing:

1. **Push to GitHub**: Push this repository to GitHub.
2. **Import to Vercel**: In your [Vercel Dashboard](https://vercel.com/new), click **Import**.
3. **Configure Environment Variable** (*Critical*):
   In **Project Settings > Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your-google-gemini-api-key` (from [Google AI Studio](https://aistudio.google.com/app/apikey))
4. **Deploy**:
   Click **Deploy**. Vercel automatically deploys the Vite frontend and the `/api/chat` serverless backend function without any extra configuration needed.
