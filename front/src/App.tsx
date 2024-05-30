import { LoginForm } from "./pages/login";

export function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
