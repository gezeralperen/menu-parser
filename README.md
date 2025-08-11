# Menu Parser & Chat Assistant

A **Next.js 13+ App Router** application for scanning and parsing in-flight menus, storing them in a structured schema, and enabling passengers to chat with an AI assistant about the available dishes.

Built with **TypeScript**, **React**, **Zod**, and **LangChain** (OpenAI-compatible APIs).

---

## ✨ Features

- **Menu OCR & Parsing** – Captures printed menus via device camera, extracts structured data (`ParsedMenu` schema) using an LLM with JSON mode.
- **Multi-language Support** – UI and parsing output can be localized to the passenger’s chosen language.
- **AI Chat Assistant** – Answers menu-related questions, suggests relevant follow-up queries.
- **Contextual Awareness** – Chat preserves conversation history and uses the parsed menu as grounding.
- **Schema Validation** – All parsed data validated via a shared [Zod](https://zod.dev/) schema.
- **Server/Client Separation** – LLM calls and schema parsing run on the server only.
- **Reusable Modules** – Prompts, chains, and schemas organized for modular reuse.

---

## 🗂 Project Structure

```plaintext
src/
  ai/
    prompts/              # Prompt templates for parsing & chat
    chains.ts             # LangChain builders for LLM calls
  app/
    api/
      parse-menu/route.ts # API: image → parsed menu JSON
      chat/route.ts       # API: chat with AI about the menu
    layout.tsx            # Root layout providers
    page.tsx              # Language selection page
    scan/page.tsx         # Camera scanner page
    menu/page.tsx         # Menu display + chat overlay
  components/             # UI components
  context/                # React Context providers (Language, Menu, Chat)
  hooks/                  # Custom hooks (camera access, etc.)
  i18n/                   # Localization base & dictionaries
  schema/                 # Zod schemas for menu, API, and i18n
  styles/                 # Global and component CSS
```

---

## 📦 Tech Stack

- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/docs/app)
- **Language**: TypeScript
- **UI**: React, CSS Modules + custom utility classes
- **State Management**: React Context API
- **Validation**: Zod
- **LLM Integration**: LangChain + OpenAI-compatible APIs
- **Hosting**: Vercel

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/menu-parser-chat.git
cd menu-parser-chat
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 📜 API Endpoints

### **POST** `/api/parse-menu`

Uploads a menu image and returns parsed JSON.

**Request:** (multipart/form-data)

- `image` – Menu image file
- `locale` – UI language code (e.g., `"en"`, `"tr"`)

**Response:**

```json
{
  "source": "vision-llm",
  "locale": "en",
  "currency": "USD",
  "sections": [ ... ],
  "warnings": [ ... ],
  "suggestions": [ ... ]
}
```

---

### **POST** `/api/chat`

Sends a question and menu context to the assistant.

**Request:**

```json
{
  "locale": "en",
  "question": "Which vegetarian dishes are available?",
  "menu": {
    /* ParsedMenuRuntime object */
  },
  "history": [
    { "role": "user", "text": "Any vegan options?" },
    { "role": "assistant", "text": "We have Vegan Salad and Lentil Soup." }
  ]
}
```

**Response:**

```json
{
  "answer": "We have Vegetarian Pasta, Garden Salad, and Lentil Soup.",
  "suggestions": [
    "Do you have gluten-free options?",
    "What desserts are available?"
  ]
}
```

---

## 🧪 Development Notes

- **Prompt Design** – System prompts in `ai/prompts` fully define parsing and chat behavior.
- **Type Safety** – Shared Zod schemas used across client & server.
- **Camera Integration** – `useCamera` hook handles permissions, capture, and preview.
- **Animations** – Framer Motion used for UI transitions.

---

## ⚠️ Common Pitfalls

- **Extra Exports in API Routes** – Next.js API routes can only export specific handlers and config. Keep constants in separate files.
- **Null Values in Output** – Zod schema omits nulls; missing fields should be excluded entirely.

---

## 📄 License

MIT License – feel free to use, modify, and distribute.
