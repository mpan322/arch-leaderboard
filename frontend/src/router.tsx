import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './home';
import App from './app';
import { SignUp } from './sign-up';
import { Login } from './login';
import { Account } from './account';
import { Otp } from './otp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/otp",
        element: <Otp />,
      },
    ],
  },
]);

export function Router() {
  return (
    <RouterProvider router={router} />
  );
}


