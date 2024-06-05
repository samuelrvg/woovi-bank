import { useMutation } from '@apollo/client';
import { SIGN_UP_MUTATION } from '../graphql/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string(),
  cpfCnpj: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

interface SignUpResponse {
  signUp: {
    name: string;
    cpfCnpj: string;
    token: string;
  };
}

interface SignUpVariables {
  name: string;
  cpfCnpj: string;
  password: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cpfCnpj: '',
      password: '',
    },
  });

  const [signUp, { loading, error }] = useMutation<SignUpResponse, SignUpVariables>(SIGN_UP_MUTATION);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await signUp({
        variables: data,
      });

      if (response.data) {
        localStorage.setItem('token', response.data.signUp.token);
        console.log('Signed up successfully:', response.data.signUp);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Sign Up</CardTitle>
            <CardDescription className='mb-2'>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="name"
                          placeholder="Max"
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
                  name="cpfCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cpfCnpj">CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="cpfCnpj"
                          placeholder="12345678900"
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
                          placeholder="********"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/signin" className="underline">Sign in</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
