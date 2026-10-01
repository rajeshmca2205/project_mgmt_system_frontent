import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import TaskForm from "../components/TaskForm";

import type {
  Project,
  Task,
  TaskRequest,
} from "../types";

const ProjectDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [project, setProject] =
    useState<Project | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  useEffect(() => {

    if (!projectId) {
      return;
    }

    loadData();

  }, [projectId]);

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        projectResponse,
        tasksResponse,
      ] = await Promise.all([

        api.get<Project>(
          `/api/projects/${projectId}`
        ),

        api.get<Task[]>(
          `/api/tasks/project/${projectId}`
        ),

      ]);

      setProject(projectResponse.data);
      setTasks(tasksResponse.data);

    } catch (error) {

      console.error(error);

      alert("Failed to load project");

      navigate("/projects");

    } finally {

      setLoading(false);

    }
  };

  const handleCreateTask = async (
    data: TaskRequest
  ) => {

    try {

      await api.post(
        "/api/tasks",
        data
      );

      setShowTaskForm(false);

      await loadData();

    } catch (error) {

      console.error(error);

      alert("Failed to create task");

    }

  };

  const handleUpdateTask = async (
    data: TaskRequest
  ) => {

    if (!editingTask) {
      return;
    }

    try {

      await api.put(
        `/api/tasks/${editingTask.id}`,
        data
      );

      setEditingTask(null);
      setShowTaskForm(false);

      await loadData();

    } catch (error) {

      console.error(error);

      alert("Failed to update task");

    }

  };

  const handleDeleteTask = async (
    taskId: number
  ) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/api/tasks/${taskId}`
      );

      await loadData();

    } catch (error) {

      console.error(error);

      alert("Failed to delete task");

    }

  };

  const openCreateTask = () => {

    setEditingTask(null);
    setShowTaskForm(true);

  };

  const openEditTask = (
    task: Task
  ) => {

    setEditingTask(task);
    setShowTaskForm(true);

  };

  if (loading) {

    return (
      <div className="p-6 text-slate-500">
        Loading project...
      </div>
    );

  }

  if (!project) {

    return (
      <div className="p-6 text-slate-500">
        Project not found.
      </div>
    );

  }

  return (
    <div className="space-y-6">

      {/* Back */}

      <Link
        to="/projects"
        className="inline-flex text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Projects
      </Link>

      {/* Project information */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">

        <div className="flex flex-col justify-between gap-4 sm:flex-row">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-2xl font-bold text-slate-900">
                {project.name}
              </h1>

              <ProjectStatusBadge
                status={project.status}
              />

            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {project.description ||
                "No project description"}
            </p>

          </div>

        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

          <InfoItem
            label="Start Date"
            value={project.startDate || "-"}
          />

          <InfoItem
            label="End Date"
            value={project.endDate || "-"}
          />

          <InfoItem
            label="Total Tasks"
            value={String(tasks.length)}
          />

        </div>

      </div>

      {/* Task section */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Tasks
            </h2>

            <p className="text-sm text-slate-500">
              Manage tasks for this project
            </p>

          </div>

          <button
            onClick={openCreateTask}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Task
          </button>

        </div>

        {/* Task form */}

        {showTaskForm && (

          <div className="border-b border-slate-200 p-5">

            <h3 className="mb-5 font-semibold text-slate-900">

              {editingTask
                ? "Edit Task"
                : "Create Task"}

            </h3>

            <TaskForm
              projectId={projectId}
              task={editingTask}
              onSubmit={
                editingTask
                  ? handleUpdateTask
                  : handleCreateTask
              }
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />

          </div>

        )}

        {/* Tasks */}

        {tasks.length === 0 ? (

          <div className="p-10 text-center">

            <h3 className="font-medium text-slate-900">
              No tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add a task to start tracking project work.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {tasks.map((task) => (

              <TaskRow
                key={task.id}
                task={task}
                onEdit={openEditTask}
                onDelete={handleDeleteTask}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {

  return (
    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>

    </div>
  );
};

const ProjectStatusBadge = ({
  status,
}: {
  status: string;
}) => {

  const classes: Record<string, string> = {

    PLANNED:
      "bg-slate-100 text-slate-700",

    IN_PROGRESS:
      "bg-blue-100 text-blue-700",

    ON_HOLD:
      "bg-yellow-100 text-yellow-700",

    COMPLETED:
      "bg-green-100 text-green-700",

  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        classes[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskRow = ({
  task,
  onEdit,
  onDelete,
}: TaskRowProps) => {

  return (
    <div className="p-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-medium text-slate-900">
              {task.title}
            </h3>

            <TaskStatusBadge
              status={task.status}
            />

            <PriorityBadge
              priority={task.priority}
            />

          </div>

          <p className="mt-2 text-sm text-slate-500">
            {task.description ||
              "No description"}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Due: {task.dueDate || "-"}
          </p>

        </div>

        <div className="flex shrink-0 gap-2">

          <button
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

const TaskStatusBadge = ({
  status,
}: {
  status: string;
}) => {

  const classes: Record<string, string> = {

    TODO:
      "bg-slate-100 text-slate-700",

    IN_PROGRESS:
      "bg-blue-100 text-blue-700",

    COMPLETED:
      "bg-green-100 text-green-700",

  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        classes[status]
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const PriorityBadge = ({
  priority,
}: {
  priority: string;
}) => {

  const classes: Record<string, string> = {

    LOW:
      "bg-slate-100 text-slate-600",

    MEDIUM:
      "bg-yellow-100 text-yellow-700",

    HIGH:
      "bg-red-100 text-red-700",

  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        classes[priority]
      }`}
    >
      {priority}
    </span>
  );
};

export default ProjectDetails;