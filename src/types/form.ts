export type LoginErrorType = {
  general?: string | null;
  email?: string | null;
  password?: string | null;
};

export type CardWrapperProps = {
  title: string;
  label: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
};
