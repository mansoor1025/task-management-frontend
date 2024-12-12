import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchTasks, deleteTask, createTask, updateTask } from "./api/tasks";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import CreateTask from "@/component/createTask";
import moment from "moment";

export default function Home() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery(["tasks", statusFilter], () => fetchTasks(statusFilter));

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => queryClient.invalidateQueries(["tasks", statusFilter]),
  });

  const createMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const updateMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks"); 
      setModalOpen(false);
    },
  });

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setModalOpen(true);
  };

  const handleUpdateTask = (updatedTask) => {
    updateMutation.mutate(updatedTask);
    setModalOpen(false); 
    setCurrentTask(null); 
  };

  const handleCreateTask = (task) => {
    createMutation.mutate(task);
    setModalOpen(false); 
    setCurrentTask(null); 
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Task Management</h1>
      <div className="flex justify-start mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(true)}
        >
          Create Task
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <select
          className="border px-4 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-6 py-3 border-b-2">S.No</th>
            <th className="px-6 py-3 border-b-2">Title</th>
            <th className="px-6 py-3 border-b-2">Description</th>
            <th className="px-6 py-3 border-b-2">Due Date</th>
            <th className="px-6 py-3 border-b-2">Status</th>
            <th className="px-6 py-3 border-b-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={task._id} className="text-center">
                <td className="px-6 py-4 border">{index + 1}</td>
                <td className="px-6 py-4 border">{task.title}</td>
                <td className="px-6 py-4 border">{task.description}</td>
                <td className="px-6 py-4 border">
                  {moment(task.dueDate).format("DD/MM/YYYY")}
                </td>
                <td className="px-6 py-4 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : task.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 border flex justify-center gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditTask(task)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(task._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <CreateTask
              onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
              onClose={() => {
                setModalOpen(false), setCurrentTask(null);
              }}
              initialData={currentTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}
