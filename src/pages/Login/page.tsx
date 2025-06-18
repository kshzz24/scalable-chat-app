import { z } from "zod";
import AuthLayout from "@/layouts/AuthLayout";
import CardWrapper from "@/components/CardWrapper";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/routes";
import { AuthResponse } from "@/types/form";
import { useAuthStore } from "@/store";
// Zod validation schema

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (user: AuthResponse) => {
      console.log(user, "userDetails via login");
      setUser({ ...user.user, token: user.token });
      navigate("/");
    },
  });

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    loginUser(data);
  };
  return (
    <AuthLayout>
      <CardWrapper
        label={"Login in your Account"}
        title={"Log In"}
        backButtonHref={"/signup"}
        backButtonLabel={"Didn't have an account? Sign Up"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="johndoe@gmail.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name={"password"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </AuthLayout>
  );
};

export default LoginPage;
