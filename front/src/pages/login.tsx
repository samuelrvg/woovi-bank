"use client"

import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  cpf: z.string().min(11, {
    message: "CPF must be at least 11 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

interface LoginResponse {
  login: {
    name: string;
    cpf: string;
    token: string;
  }
}

interface LoginVariables {
  cpf: string;
  password: string;
}

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const [login, { loading, error }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // cpf: "12345678901",
      // password: "password123"
      const response = await login({
        variables: data
      });

      if (response.data) {
        localStorage.setItem('token', response.data.login.token);
        console.log('Logged in successfully:', response.data.login);
        // Redirecionar ou fazer outras ações após o login bem-sucedido
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
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
  );
}

export default LoginForm;