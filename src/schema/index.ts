import { z } from "zod";

export const RegisterSchema = z
  .object({
    username: z.string().min(2, {
      message: "Please enter a name",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Please enter a valid password",
    }),
    confirmPassword: z.string().min(6, {
      message: "Please enter a valid password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Show the error under confirmPassword field
  });

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
