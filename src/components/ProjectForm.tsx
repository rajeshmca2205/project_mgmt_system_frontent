import { useEffect, useState } from "react";

import type {
  Project,
  ProjectRequest,
  ProjectStatus,
} from "../types";

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectRequest) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm = ({
  project,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {

  const [form, setForm] = useState<ProjectRequest>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "PLANNED",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (project) {

      setForm({
        name: project.name,
        description: project.description || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        status: project.status,
      });

    } else {

      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "PLANNED",
      });

    }

  }, [project]);

  const handleChange = (
    field: keyof ProjectRequest,
    value: string
  ) => {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {

      setSaving(true);

      await onSubmit(form);

    } finally {

      setSaving(false);

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Project Name ........
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            handleChange("name", e.target.value)
          }
          placeholder="Enter project name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
          placeholder="Enter project description"
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <div>

          <label className="mb-1 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              handleChange("startDate", e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        <div>

          <label className="mb-1 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              handleChange("endDate", e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      <div>

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          value={form.status}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value as ProjectStatus
            )
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >

          <option value="PLANNED">
            Planned
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="ON_HOLD">
            On Hold
          </option>

          <option value="COMPLETED">
            Completed
          </option>

        </select>

      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : project
              ? "Update Project"
              : "Create Project"}
        </button>

      </div>

    </form>
  );
};

export default ProjectForm;