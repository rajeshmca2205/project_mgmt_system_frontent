import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import ProjectForm from "../components/ProjectForm";

import type {
  Project,
  ProjectRequest,
} from "../types";

const Projects = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {

    try {

      setLoading(true);

      const response =
        await api.get<Project[]>("/api/projects");

      setProjects(response.data);

    } catch (error) {

      console.error("Failed to load projects", error);

      alert("Failed to load projects");

    } finally {

      setLoading(false);

    }
  };

  const handleCreate = async (
    data: ProjectRequest
  ) => {

    try {

      await api.post(
        "/api/projects",
        data
      );

      setShowForm(false);

      await loadProjects();

    } catch (error) {

      console.error(error);

      alert("Failed to create project");

    }

  };

  const handleUpdate = async (
    data: ProjectRequest
  ) => {

    if (!editingProject) {
      return;
    }

    try {

      await api.put(
        `/api/projects/${editingProject.id}`,
        data
      );

      setEditingProject(null);

      setShowForm(false);

      await loadProjects();

    } catch (error) {

      console.error(error);

      alert("Failed to update project");

    }

  };

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/api/projects/${id}`
      );

      await loadProjects();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete project. Make sure it has no tasks."
      );

    }

  };

  const openCreate = () => {

    setEditingProject(null);
    setShowForm(true);

  };

  const openEdit = (
    project: Project
  ) => {

    setEditingProject(project);
    setShowForm(true);

  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage your projects  ........
          </p>

        </div>

        <button
          onClick={openCreate}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New Project
        </button>

      </div>

      {/* Form */}

      {showForm && (

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">

          <h2 className="mb-5 text-lg font-semibold text-slate-900">

            {editingProject
              ? "Edit Project"
              : "Create Project"}

          </h2>

          <ProjectForm
            project={editingProject}
            onSubmit={
              editingProject
                ? handleUpdate
                : handleCreate
            }
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />

        </div>

      )}

      {/* Project list */}

      {loading ? (

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading projects...
        </div>

      ) : projects.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">

          <h3 className="font-semibold text-slate-900">
            No projects yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create your first project to get started.
          </p>

          <button
            onClick={openCreate}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Create Project
          </button>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}

    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) => {

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <h2 className="font-semibold text-slate-900">
          {project.name}
        </h2>

        <ProjectStatusBadge
          status={project.status}
        />

      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-500">
        {project.description ||
          "No project description"}
      </p>

      <div className="mt-4 space-y-1 text-xs text-slate-500">

        <p>
          Start: {project.startDate || "-"}
        </p>

        <p>
          End: {project.endDate || "-"}
        </p>

      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

        <Link
          to={`/projects/${project.id}`}
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
        >
          View
        </Link>

        <button
          onClick={() => onEdit(project)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project.id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>

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
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        classes[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default Projects;