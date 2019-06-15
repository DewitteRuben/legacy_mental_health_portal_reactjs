import fetch from "../../utils/fetch";
import { getJWTToken, getProfId } from "../localStorage";
const apiUrl = "http://localhost:3000/api";

export const authLogin = () => {
  return fetch(`${apiUrl}/auth/login`);
};

export const registerClient = (clientData: any, profId: string) => {
  return fetch(`${apiUrl}/register/client`, {
    body: {
      ...clientData,
      profId
    },
    method: "POST"
  });
};

export const getAvailableClients = () => {
  const profId = getProfId();
  return fetch(`${apiUrl}/professional/clients/${profId}`);
};

export const getClientByUserId = (userId: string) => {
  const profId = getProfId();
  return fetch(`${apiUrl}/professional/clients/${userId}/${profId}`);
};

export const addTaskByUserId = (userId: string, task: any) => {
  const token = getJWTToken();
  return fetch(`${apiUrl}/task/${userId}`, {
    method: "POST",
    body: {
      ...task
    },
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const getTasksByUserId = (userId: string) => {
  const profId = getProfId();
  const token = getJWTToken();
  return fetch(`${apiUrl}/task/${userId}/${profId}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const getClientMoodDataByUserId = (userId: string) => {
  const token = getJWTToken();
  const profId = getProfId();

  return fetch(`${apiUrl}/mood/${userId}/${profId}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const getClientWeightDataByUserId = (userId: string) => {
  const token = getJWTToken();
  const profId = getProfId();

  return fetch(`${apiUrl}/weight/${userId}/${profId}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const authProfessional = (email: string, password: string) => {
  return fetch(`${apiUrl}/auth/professional`, {
    method: "POST",
    body: {
      email,
      password
    }
  });
};

export const removeTask = (userId: string, taskId: string) => {
  const token = getJWTToken();

  return fetch(`${apiUrl}/task/${userId}/${taskId}/`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const removeClient = (userId: string) => {
  const token = getJWTToken();
  const profId = getProfId();
  return fetch(`${apiUrl}/client/${userId}/${profId}/`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};
