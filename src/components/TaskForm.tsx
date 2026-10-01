import { useState, type FormEvent, type ChangeEvent } from "react";
import api from "../services/api";

interface TaskFormProps {
  projectId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function TaskForm({
  projectId,
  onSuccess,
  onCancel,
}: TaskFormProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");

  const [attachment, setAttachment] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setAttachment(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("status", status);
      formData.append("dueDate", dueDate);
      formData.append(
        "projectId",
        projectId.toString()
      );

      if (attachment) {
        formData.append(
          "attachment",
          attachment
        );
      }

      await api.post(
        "/api/tasks",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess();

    } catch (error) {

      console.error(
        "Failed to create task:",
        error
      );

      alert("Unable to create task");

    } finally {

      setLoading(false);

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* TITLE */}
      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Task Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Enter task title"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* DESCRIPTION */}
      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          placeholder="Enter task description"
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* PRIORITY + STATUS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div>

          <label className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
          >

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

          </select>

        </div>

        <div>

          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
          >

            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>

          </select>

        </div>

      </div>

      {/* DUE DATE */}
      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
        />

      </div>

      {/* ATTACHMENT */}
      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Attachment
        </label>

        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />

        {attachment && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">

            <div className="min-w-0">

              <p className="truncate text-sm font-medium text-slate-700">
                {attachment.name}
              </p>

              <p className="text-xs text-slate-500">
                {(attachment.size / 1024).toFixed(1)} KB
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setAttachment(null)
              }
              className="ml-3 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>

          </div>
        )}

      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

      </div>

    </form>
  );
}

export default TaskForm;