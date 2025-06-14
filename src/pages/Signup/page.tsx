import CardWrapper from "@/components/CardWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/routes";
import { AuthUser } from "@/types/form";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (user: AuthUser) => {
      setUser(user);
      navigate("/");
    },
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    registerUser(data);
  };

  return (
    <AuthLayout>
      <CardWrapper
        label={"Create An Account"}
        title={"Register"}
        backButtonHref={"/login"}
        backButtonLabel={"Already have a account? Login here"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name={"username"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input {...field} type="text" placeholder="John doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name={"confirmPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Confirm Password</FormLabel>

                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </AuthLayout>
  );
};

export default Signup;
