"use client"

import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  cpf: z.string().min(11, {
    message: "CPF must be at least 11 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface LoginResponse {
  login: {
    name: string;
    cpf: string;
    token: string;
  };
}

interface LoginVariables {
  cpf: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "59091028009",
      password: "woovi#123",
    },
  });

  const [login, { loading, error }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await login({
        variables: data,
      });

      if (response.data) {
        localStorage.setItem('token', response.data.login.token);
        console.log('Logged in successfully:', response.data.login);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your CPF and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cpf">CPF</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="cpf"
                          placeholder="Digite seu CPF"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="Digite sua senha"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              {/* Link to your signup page */}
              <a href="/signup" className="underline">Sign up</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginForm;