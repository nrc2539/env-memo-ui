import { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import type { UserProfileType } from "@/models/UserProfileType";

interface WrapperOptions {
  initialEntries?: string[];
  authContext?: Partial<AuthContextType>;
  queryClient?: QueryClient;
}

const defaultAuth: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setToken: () => {},
  clearUserData: () => {},
};

const defaultUser: UserProfileType = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
};

function createWrapper(options: WrapperOptions = {}) {
  const {
    initialEntries = ["/"],
    authContext = {},
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    }),
  } = options;

  const mergedAuth = { ...defaultAuth, ...authContext };

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthContext.Provider value={mergedAuth}>
            {children}
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

function customRender(
  ui: ReactElement,
  options?: RenderOptions & WrapperOptions,
) {
  const { initialEntries, authContext, queryClient, ...renderOptions } =
    options ?? {};

  return render(ui, {
    wrapper: createWrapper({ initialEntries, authContext, queryClient }),
    ...renderOptions,
  });
}

export { customRender as render, defaultUser, defaultAuth };
export type { WrapperOptions };
