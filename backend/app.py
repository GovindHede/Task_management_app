from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
import uuid
from datetime import datetime

app = FastAPI()

TASKS_FILE = "tasks.json"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Accept only title & description from frontend
class TaskCreate(BaseModel):
    title: str
    description: str

# Full task with ID, timestamps, etc.
class Task(TaskCreate):
    id: str
    completed: bool = False
    createdAt: str

def load_tasks():
    try:
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

@app.get("/tasks")
def get_tasks():
    return load_tasks()

@app.post("/tasks")
def create_task(task_data: TaskCreate):
    task = Task(
        id=str(uuid.uuid4()),
        title=task_data.title,
        description=task_data.description,
        completed=False,
        createdAt=datetime.utcnow().isoformat()
    )
    tasks = load_tasks()
    tasks.insert(0, task.dict())
    save_tasks(tasks)
    return task
