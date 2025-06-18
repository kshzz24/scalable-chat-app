import { create } from "zustand";
import { User } from "./types/form";
import { persist } from "zustand/middleware";
interface AuthState {
  user: null | User;
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
}
interface ContactUser {
  _id: string;
  username: string;
  email: string;
  status?: string; // Optional: online/offline
  // Add avatar, etc. if needed
}

interface ContactsStore {
  contacts: ContactUser[];
  setContacts: (contacts: ContactUser[]) => void;
  getContactById: (id: string) => ContactUser | undefined;
  reset: () => void;
}

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      setContacts: (contacts) => set({ contacts }),
      getContactById: (id) => get().contacts.find((c) => c._id === id),
      reset: () => set({ contacts: [] }),
    }),
    {
      name: "contact-details", // localStorage key
    }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
