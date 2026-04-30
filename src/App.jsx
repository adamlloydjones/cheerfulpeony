import { useState, useEffect } from "react";

export default function App() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  async function fetchEvents() {
    const res = await fetch("/.netlify/functions/getEvents");
    const data = await res.json();
    setEvents(data);
  }

  async function createEvent() {
    await fetch("/.netlify/functions/createEvent", {
      method: "POST",
      body: JSON.stringify({ title, date })
    });

    setTitle("");
    setDate("");
    fetchEvents();
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scheduler</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={createEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {events.map((e) => (
          <li key={e.id} className="border-b py-2">
            {e.title} — {new Date(e.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}


```

---

# 2. NETLIFY FUNCTIONS (.mjs)

## netlify/functions/getEvents.mjs
```js

```

## netlify/functions/createEvent.mjs
```js

```

---

# 3. DATABASE (Supabase SQL)

```sql

```

---

# 4. CONFIG FILES

## netlify.toml
```toml

```

## package.json
```json
{
  "name": "scheduler-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

## .env (local dev)
```
SUPABASE_URL=your_url
SUPABASE_KEY=your_anon_key
```

---

# 5. HOW TO RUN

```bash
npm install
npm run dev
```

Deploy by pushing to Netlify.

---

# NEXT STEP (RECOMMENDED)

Right now this is structurally correct—but still fragile.

You should next:
- Add input validation in functions
- Handle errors (try/catch + status codes)
- Add auth (otherwise anyone can write to your DB)
- Add delete/update endpoints

If you want, I can refactor this into a production-grade architecture (service layer, validation, auth, etc.).
