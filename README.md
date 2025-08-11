# Menu Parser & Chat Assistant

A **Next.js 13+ App Router** project that parses restaurant menus, stores structured menu data, and enables users to chat with an AI assistant about the menu.  
Built with **TypeScript**, **React**, and an LLM integration for natural language menu queries.

---

## ✨ Features

- **Menu Parsing** – Extracts structured data from restaurant menus into a standardized `ParsedMenu` schema.
- **LLM Integration** – Uses a prompt template to answer natural language questions about the menu.
- **Chat UI** – Real-time Q&A with context awareness and conversation history.
- **Type-safe API** – End-to-end type checking for API routes and client interactions.
- **Schema Validation** – Uses [Zod](https://zod.dev/) to validate LLM output and API inputs.
- **Server/Client Separation** – All heavy LLM calls and schema checks are handled server-side.
- **Modular Architecture** – Prompts, chains, and schema definitions are extracted into reusable modules.

---

## 🗂 Project Structure

```plaintext
src/
  app/
    api/
      chat/
        route.ts         # API route for chat requests
    page.tsx             # Example page (entry point)
  components/            # UI components (chat, layout, etc.)
  context/
    ChatContext.tsx      # Global chat state management
  schema/
    menu.ts              # Zod schema for ParsedMenu
  ai/
    prompts/             # Prompt templates
    chains/              # LLM chain builders
```

---

## 📦 Tech Stack

- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/docs/app)
- **Language**: TypeScript
- **UI**: React, CSS Modules
- **State Management**: React Context API
- **Validation**: Zod
- **LLM Integration**: OpenAI-compatible APIs (PromptTemplate)
- **Build**: Vercel / Next.js build system

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

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 API Usage

**POST** `/api/chat`  
Send a question and menu context to the AI.

```json
{
  "menu": {
    /* ParsedMenu object */
  },
  "history": [],
  "question": "Which vegan dishes do you have?"
}
```

**Response:**

```json
{
  "answer": "We have Vegan Salad, Grilled Vegetables, and Lentil Soup."
}
```

---

## 🧪 Development Notes

- **Prompts**: Defined in `@/ai/prompts`, separated from API routes to satisfy Next.js constraints.
- **Schemas**: Single source of truth for `ParsedMenu` in `@/schema/menu.ts` to avoid divergence.
- **Type Safety**: Ensure API routes only export allowed Next.js route fields (e.g., `GET`, `POST`, `config`, etc.).

---

## ⚠️ Common Pitfalls

- **Exporting Extra Variables from API Routes**:  
  Next.js allows only route methods and a small whitelist of exports. Move constants like `prompt` to a helper file.
- **Array Typos in State Updates**:  
  Always use `[...]` (spread syntax) instead of `[.prev]`.

---

## 📄 License

MIT License – feel free to use, modify, and distribute.
