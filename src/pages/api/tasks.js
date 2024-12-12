import axios from "axios";
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const createTask = async (task) => {
  const response = await axios.post(`${BASE_URL}/api/tasks/createTask`, task);
  return response.data;
};

export const fetchTasks = async (status) => {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await axios.get(`${BASE_URL}/api/tasks${query}`);
    return response.data.tasks;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const updateTask = async (task) => {
  const response = await axios.put(`${BASE_URL}/api/tasks/updateTask`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${BASE_URL}/api/tasks/deleteTask`, {
    data: { id },
  });
};
