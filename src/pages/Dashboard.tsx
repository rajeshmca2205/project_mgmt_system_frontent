import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import type { Project, Task } from "../types";

const Dashboard = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [projectsResponse, tasksResponse] =
        await Promise.all([
          api.get<Project[]>("/api/projects"),
          api.get<Task[]>("/api/tasks"),
        ]);

      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);

    } catch (error) {
      console.error("Dashboard loading failed", error);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your projects and tasks
        </p>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Projects"
          value={projects.length}
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
        />

        <StatCard
          title="Completed Projects"
          value={completedProjects}
        />

        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
        />

      </div>

      {/* Recent Projects */}

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Projects
            </h2>

            <p className="text-sm text-slate-500">
              Your projects
            </p>
          </div>

          <Link
            to="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>

        </div>

        <div className="divide-y divide-slate-100">

          {projects.length === 0 ? (

            <div className="p-6 text-center text-sm text-slate-500">
              No projects available.
            </div>

          ) : (

            projects.slice(0, 5).map((project) => (

              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-5 hover:bg-slate-50"
              >

                <div className="flex flex-col justify-between gap-3 sm:flex-row">

                  <div>
                    <h3 className="font-medium text-slate-900">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {project.description || "No description"}
                    </p>
                  </div>

                  <StatusBadge status={project.status} />

                </div>

              </Link>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};

const StatusBadge = ({
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
      className={`inline-flex h-fit rounded-full px-3 py-1 text-xs font-medium ${
        classes[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default Dashboard;