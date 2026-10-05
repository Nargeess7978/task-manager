"use client";
import { useState } from "react";

const EMPTY = { title: "", description: "", status: "PENDING", priority: "MEDIUM" };

// Same rules as the server (lib/validation.js) so users get instant feedback.
function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  else if (values.title.trim().length > 100) errors.title = "Title must be 100 characters or fewer";
  if (values.description.length > 500) errors.description = "Description must be 500 characters or fewer";
  return errors;
}

export default function TaskForm({ task, onSave, onCancel }) {
  const [values, setValues] = useState(task ?? EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const serverErrors = await onSave(values); // returns field errors on failure
    setSaving(false);
    if (serverErrors) setErrors(serverErrors);
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{task ? "Edit task" : "New task"}</h2>

        <label>
          Title
          <input name="title" value={values.title} onChange={change} maxLength={120} autoFocus />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Description
          <textarea name="description" rows={3} value={values.description} onChange={change} />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </label>

        <div className="row">
          <label>
            Status
            <select name="status" value={values.status} onChange={change}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
          <label>
            Priority
            <select name="priority" value={values.priority} onChange={change}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
        </div>

        {errors.form && <p className="field-error">{errors.form}</p>}

        <div className="actions">
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : "Save task"}
          </button>
        </div>
      </form>
    </div>
  );
}
