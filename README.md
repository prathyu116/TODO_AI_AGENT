# 📌 To-Do AI Agent

An AI-powered to-do list assistant that enables users to manage tasks through natural language interactions. The assistant follows a structured approach—**START, PLAN, ACTION, OBSERVATION, and OUTPUT**—to process user queries and perform actions such as creating, searching, retrieving, and deleting tasks from a database.

## 🚀 Features
- **AI-Driven Task Management** – Handles to-do list operations via natural language.
- **Structured Reasoning Process** – Implements automated planning and execution.
- **Database Operations** – Uses Drizzle ORM to interact with PostgreSQL.
- **Interactive CLI** – Enables users to manage tasks efficiently through a command-line interface.

## 🛠️ Tech Stack
- **Backend:** Node.js, Drizzle ORM, PostgreSQL
- **AI Integration:** OpenAI API
- **CLI Interaction:** Readline-sync

## 📦 Installation
1. **Clone the repository:**  
   ```sh
   git clone https://github.com/your-username/todo-ai-agent.git
   cd todo-ai-agent
   ```
2. **Install dependencies:**  
   ```sh
   npm install
   ```
3. **Set up environment variables:**  
   Create a `.env` file and add your OpenAI API key and database connection details:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_database_url
   ```
4. **Run the application:**  
   ```sh
   node index.js
   ```

## 📖 Usage
1. Run the application.
2. Enter natural language commands, such as:
   ```
   Enter your query: Add a task for shopping groceries.
   ```
3. The AI agent will process the request and perform the necessary actions.
4. Example AI response:
   ```
   🤖: Todo created successfully
   ```



---

💡 *Built with Node.js, AI, and PostgreSQL to make task management smarter!* 🚀

