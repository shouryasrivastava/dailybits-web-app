import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi, describe, test, expect, beforeEach } from "vitest";
import Login from "./Login";

// hoisted mocks
const {
  mockNavigate,
  mockSaveToken,
  mockSaveUser,
  mockSetCurrentUser,
  mockLogout,
  mockSignInWithPassword,
} = vi.hoisted(() => {
  return {
    mockNavigate: vi.fn(),
    mockSaveToken: vi.fn(),
    mockSaveUser: vi.fn(),
    mockSetCurrentUser: vi.fn(),
    mockLogout: vi.fn(),
    mockSignInWithPassword: vi.fn(),
  };
});

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  },
}));

vi.mock("../utils/auth", () => ({
  saveToken: mockSaveToken,
  saveUser: mockSaveUser,
}));

vi.mock("../utils/storage", () => ({
  setCurrentUser: mockSetCurrentUser,
  logout: mockLogout,
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  test("logs in successfully and redirects to /todo", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: "mock-token",
        },
      },
      error: null,
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        accountNumber: 12,
        email: "test@example.com",
        firstName: "Daniel",
        lastName: "Yue",
        registerDate: "2026-04-13",
        isStudent: true,
        isAdmin: false,
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(mockSaveToken).toHaveBeenCalledWith("mock-token");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/auth/me/",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(mockSaveUser).toHaveBeenCalled();
      expect(mockSetCurrentUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/todo");
    });
  });

  test("shows error message when Supabase login fails", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "wrong@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid login credentials")).toBeInTheDocument();
    });

    expect(mockSaveToken).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows error when /auth/me/ fails", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: "mock-token",
        },
      },
      error: null,
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "Failed to load user profile",
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load user profile"),
      ).toBeInTheDocument();
    });

    expect(mockSaveToken).toHaveBeenCalledWith("mock-token");
    expect(mockSaveUser).not.toHaveBeenCalled();
    expect(mockSetCurrentUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
