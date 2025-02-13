import { ilike } from "drizzle-orm";
import { db } from "./db/index.js";
import {todosTable} from "./db/schema.js"
import OpenAI from "openai";
import readlineSync from "readline-sync";
const client = new OpenAI();

async function getAllTodos() {
    const todos = await db.select().from(todosTable)
    return todos;
}

async function createTodo(todo) {
    const [result] = await db.insert(todosTable).values({ todo }).returning({id:todosTable.id})
    return result.id;
}

async function searchTodos(search){
    const todos = await db.select().from(todosTable).where(ilike(todosTable.todo,`%${search}%`))
    return todos;
}
async function deleteTodoById(id){
    await db.delete(todosTable).where(todosTable.id.equals(id))
}
const tools = {
    getAllTodos,
    createTodo,
    searchTodos,
    deleteTodoById
}
const SYSTEM_PROMPT = ` 
You are an AI To-Do List Assistant with START, PLAN, ACTION, Obeservation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action
Once you get the observations, Return the AI response based on START propmt and observations


You can manage tasks by adding, viewing, updating, and deleting them.
You must strictly follow the JSON output format.


Todo DB schema:
id: Int and Primary Key
todo: String
created_at: Date Time
updated_at: Date Time

Available Tools:
 - getAllTodos(): Returns all the Todos from Database
 - createTodo (todo: string): Creates a new Todo in the DB and takes todo as a string and returns ID of created
 - deleteTodoById(id: string): Deleted the todo by ID given in the DB
 - search Todo (query: string): Searches for all todos matching the query string using ilike in DB


Example:
START
{ "type":"user","user":"Add a task for shopping groceries." }
 {"type":"plan","plan":"i will try to get more context on what user need to shop}
 {"type":"output","output":"Can you tell me what all items you want to shop for?"}
{ "type":"user","user":"I want to shop for ball"}
{ "type":"plan","plan":"i will use createTodo to create new Todo in DB"}
{ "type":"action","function":"createTodo","todo":"shopping for ball"}
{ "type":"observation","observation":"2"}
{ "type":"output","output":"Todo created successfully" }
`
const messages = [{role:'system',content:SYSTEM_PROMPT}] ;

while(true){
    const query = readlineSync.question("Enter your query: ");
    const userMessage = {
        role:'user',
        user:query
    }
    messages.push({role:'user',content:JSON.stringify(userMessage)});
//auto prompting
    while(true){
        const chat = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            response_format:{type: 'json_object',}
        })
        const result = chat.choices[0].message.content;
        messages.push({role:"assistant",content: result})
        const action = JSON.parse(result)
        if(action.type === "output"){
            console.log("🤖: ",action.output)
            break;
        }else if(action.type === "action"){
            const fn = tools[action.function]
            if(!fn){throw new Error("Invalid Tool Call")}
            const observation = await fn(action.input)
            const observationMessage = {
                type:"observation",
                observation
            }
            messages.push({role:"developer",content:JSON.stringify(observationMessage)})

        }

    }

}