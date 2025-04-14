// Dashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUser = { name: "Demo User" };

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState(mockUser);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/tasks");
        const data = await response.json();

        const cleanedTasks = data.map(task => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
        }));

        setTasks(cleanedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
      };

      try {
        const response = await fetch("http://localhost:8000/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const createdTask = await response.json();
          setTasks([{ ...createdTask, createdAt: new Date(createdTask.createdAt) }, ...tasks]);
          setNewTaskTitle("");
          setNewTaskDescription("");
          setShowModal(false);
        } else {
          console.error("Failed to add task:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === "active") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "Invalid date";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>Task Zen</h1>
        <div>
          <span>Hello, {user?.name}</span>
          <button style={styles.buttonOutline} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <h2>My Tasks</h2>
            <p>Manage your tasks efficiently</p>
          </div>
          <button style={styles.button} onClick={() => setShowModal(true)}>+ Add Task</button>
        </div>

        <div style={styles.tabs}>
          <button onClick={() => setActiveTab("all")} style={tabStyle(activeTab === "all")}>All</button>
          <button onClick={() => setActiveTab("active")} style={tabStyle(activeTab === "active")}>Active</button>
          <button onClick={() => setActiveTab("completed")} style={tabStyle(activeTab === "completed")}>Completed</button>
        </div>

        {filteredTasks.length === 0 ? (
          <p style={styles.empty}>No tasks in this category.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={styles.card}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</h3>
                <p style={styles.description}>{task.description}</p>
                <small style={{ color: "#666" }}>Created: {formatDate(task.createdAt)}</small>
              </div>
              <button style={styles.deleteButton} onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          ))
        )}
      </main>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Create New Task</h2>
            <input
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={3}
              style={styles.textarea}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleAddTask} style={styles.button}>Create</button>
              <button onClick={() => setShowModal(false)} style={styles.buttonOutline}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { fontFamily: "sans-serif", minHeight: "100vh", background: "#f9f9f9" },
  header: { background: "#fff", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" },
  main: { padding: "20px", maxWidth: "800px", margin: "0 auto" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  button: { padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  buttonOutline: { padding: "10px 20px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", cursor: "pointer" },
  tabs: { display: "flex", gap: "10px", marginBottom: "20px" },
  card: { display: "flex", alignItems: "flex-start", gap: "10px", background: "#fff", padding: "15px", marginBottom: "10px", borderRadius: "5px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  deleteButton: { background: "transparent", border: "none", color: "red", cursor: "pointer" },
  description: { fontSize: "14px", color: "#555", margin: "5px 0" },
  empty: { textAlign: "center", color: "#888", padding: "20px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", padding: "20px", borderRadius: "8px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" },
  textarea: { padding: "10px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" },
};

const tabStyle = (active) => ({
  padding: "10px 15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  background: active ? "#007bff" : "#fff",
  color: active ? "#fff" : "#000",
  cursor: "pointer"
});

export default Dashboard;
