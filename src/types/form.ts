export type LoginType = {
  email: string | null;
  password: string | null;
};
export type RegisterType = {
  email: string | null;
  password: string | null;
  username: string | null;
};
export type CardWrapperProps = {
  title: string;
  label: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
};

export type AuthResponse = {
  message: string;
  user: User;
  token: string;
};

export type User = {
  username: string;
  email: string;
  password: string;
  status: "offline" | "online";
  contacts: string[];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  __v: number;
  token: string;
};

export type allUserType = {
  username: string;
  email: string;
  status: "offline" | "online";

  _id: string;
};
