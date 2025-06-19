import axios from "axios";
import { LoginType, RegisterType, User } from "@/types/form";
import { useAuthStore } from "@/store";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
axios.defaults.withCredentials = true;

export const register = async (data: RegisterType): Promise<any> => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return res.data;
};

export const login = async (data: LoginType): Promise<any> => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axios.get(`${API_BASE_URL}/auth/logout`);
};

export const getAllUsers = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.token) throw new Error("No auth token found");

  const res = await axios.get(`${API_BASE_URL}/user/list`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.data.users;
};

export const getCurrentUserDetails = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.token) throw new Error("No auth token found");

  const res = await axios.get(`${API_BASE_URL}/user/details`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.data.users;
};

export const getContactDetails = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.token) throw new Error("No auth token found");

  const res = await axios.post(
    `${API_BASE_URL}/user/contact/details`,
    { contactIds: user.contacts },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return res.data.users;
};

export const sendInvites = async (receiverIds: string[]) => {
  const token = useAuthStore.getState().user?.token;
  console.log(receiverIds, "receiverIds");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.post(
    `${API_BASE_URL}/user/invite/send`,
    { receiverIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const allMyInvites = async () => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.get(`${API_BASE_URL}/user/invite/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const acceptInvite = async (inviteId: string) => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.post(
    `${API_BASE_URL}/user/invite/accept`,
    { inviteId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const rejectInvite = async (inviteId: string) => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.post(
    `${API_BASE_URL}/user/invite/reject`,
    { inviteId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const createChat = async ({
  isGroup,
  recipients,
  name,
}: {
  isGroup: boolean;
  recipients: string[];
  name?: string;
}) => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.post(
    `${API_BASE_URL}/chat/create`,
    { isGroup, recipients, name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getAllChats = async () => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.get(
    `${API_BASE_URL}/chat/all`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data?.chats;
};

export const getChatDetails = async (id: string) => {
  const token = useAuthStore.getState().user?.token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await axios.get(
    `${API_BASE_URL}/chat${id}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data?.chats;
};
