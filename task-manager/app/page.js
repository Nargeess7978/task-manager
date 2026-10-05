"use client";
import { useCallback, useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";

const STATUS_LABEL = { PENDING: "Pending", IN_PROGRESS: "In progress", COMPLETED: "Completed" };
const PRIORITY_LABEL = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

// Small wrapper: calls the API and throws a readable error on failure.
async function api(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || "Something went wrong");
    err.details = body.details;
    throw err;
  }
  return body;
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [formTask, setFormTask] = useState(null); // null = closed, {} = new, task = edit
  const [formOpen, setFormOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    try {
      setError("");
      setTasks(await api(`/api/tasks?${params}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status, priority]);

  // Debounce so we don't call the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(loadTasks, 300);
    return () => clearTimeout(timer);
  }, [loadTasks]);

  async function saveTask(values) {
    try {
      const editing = formTask && formTask.id;
      await api(editing ? `/api/tasks/${formTask.id}` : "/api/tasks", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
        }),
      });
      setFormOpen(false);
      loadTasks();
    } catch (err) {
      const fields = {};
      (err.details || []).forEach((d) => (fields[d.field] = d.message));
      return Object.keys(fields).length ? fields : { form: err.message };
    }
  }

  async function changeStatus(task, newStatus) {
    try {
      await api(`/api/tasks/${task.id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    try {
      await api(`/api/tasks/${task.id}`, { method: "DELETE" });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  const openForm = (task = null) => {
    setFormTask(task);
    setFormOpen(true);
  };

  return (
    <main className="page">
      <header className="top">
        <h1>Tasks</h1>
        <button className="btn" onClick={() => openForm()}>Add task</button>
      </header>

      <section className="filters">
        <input
          type="search"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
          <option value="">All priorities</option>
          {Object.entries(PRIORITY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </section>

      {error && <p className="banner" role="alert">{error}</p>}
      {loading && <p className="muted">Loading tasks…</p>}

      {!loading && !error && tasks.length === 0 && (
        <p className="muted">
          {search || status || priority
            ? "No tasks match these filters. Try clearing them."
            : "No tasks yet. Select Add task to create your first one."}
        </p>
      )}

      <ul className="list">
        {tasks.map((task) => (
          <li key={task.id} className={`card p-${task.priority}`}>
            <div className="card-head">
              <h3 className={task.status === "COMPLETED" ? "done" : ""}>{task.title}</h3>
              <span className={`tag prio-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
            </div>
            {task.description && <p className="desc">{task.description}</p>}
            <p className="muted small">Created {new Date(task.createdAt).toLocaleDateString()}</p>
            <div className="card-foot">
              <select
                value={task.status}
                onChange={(e) => changeStatus(task, e.target.value)}
                aria-label={`Status of ${task.title}`}
              >
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <button className="btn ghost" onClick={() => openForm(task)}>Edit</button>
              <button className="btn danger" onClick={() => deleteTask(task)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {formOpen && (
        <TaskForm task={formTask} onSave={saveTask} onCancel={() => setFormOpen(false)} />
      )}
    </main>
  );
}
