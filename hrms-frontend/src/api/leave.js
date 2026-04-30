import api from "./axios";

export const getEmployeesApi = () =>
  api.get("/api/leave/employees");

export const addEmployeeApi = (data) =>
  api.post("/api/leave/add-employee", data);

export const markAttendanceApi = (data) =>
  api.post("/api/leave/mark-attendance", data);

export const getAttendanceApi = (id) =>
  api.get(`/api/leave/attendance/${id}`);