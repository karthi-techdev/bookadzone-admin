// src/components/templates/blogCategory/__test__/BlogCategoryFormTemplate.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogCategoryFormTemplate from "../BlogCategoryFormTemplate";
import { useBlogCategoryStore } from "../../../stores/blogCategoryStore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Mock store
jest.mock("../../../stores/blogCategoryStore", () => ({
  useBlogCategoryStore: jest.fn(),
}));

// ✅ Mock react-router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// ✅ Mock toastify
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
  ToastContainer: () => <div>ToastContainer</div>,
}));

// ✅ Mock sweetalert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

// ✅ Mock validation helper
jest.mock("../../../utils/validationHelper", () => ({
  __esModule: true,
  default: {
    isRequired: jest.fn(() => ({ field: "name", message: null })),
    minLength: jest.fn(() => ({ field: "name", message: null })),
    maxLength: jest.fn(() => ({ field: "name", message: null })),
    isValidEnum: jest.fn(() => ({ field: "status", message: null })),
    validate: jest.fn(() => []),
  },
}));

// ✅ Mock ManagementForm (now respects initialValues!)
jest.mock("../../../organisms/ManagementForm", () => {
  return function MockManagementForm(props: any) {
    const values =
      props.initialValues || {
        name: "",
        slug: "",
        label: "",
        status: true,
      };

    return (
      <form
        data-testid="blogCategory-form"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit?.(values);
        }}
      >
        <input data-testid="name" value={values.name} readOnly />
        <input data-testid="slug" value={values.slug} readOnly />
        <input data-testid="status" type="checkbox" defaultChecked={values.status} />
        <button type="submit">Submit</button>
      </form>
    );
  };
});

// ✅ Mock FormHeader
jest.mock("../../../molecules/FormHeader", () => () => <div>FormHeader</div>);

describe("BlogCategoryFormTemplate", () => {
  const mockFetchBlogCategoryById = jest.fn();
  const mockAddBlogCategory = jest.fn();
  const mockUpdateBlogCategory = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValue({
      fetchBlogCategoryById: mockFetchBlogCategoryById,
      addBlogCategory: mockAddBlogCategory,
      updateBlogCategory: mockUpdateBlogCategory,
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as unknown as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  it("renders form and submits new BlogCategory", async () => {
    mockAddBlogCategory.mockResolvedValueOnce({});
    render(<BlogCategoryFormTemplate />);

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockAddBlogCategory).toHaveBeenCalledWith({
        name: "",
        slug: "",
        label: "",
        status: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/blogcategory");
    });
  });

  it("renders form and updates BlogCategory if id param exists", async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: "123" });
    mockFetchBlogCategoryById.mockResolvedValueOnce({
      name: "Old",
      slug: "old",
      status: true,
    });
    mockUpdateBlogCategory.mockResolvedValueOnce({});

    render(<BlogCategoryFormTemplate />);
    await waitFor(() =>
      expect(mockFetchBlogCategoryById).toHaveBeenCalledWith("123")
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockUpdateBlogCategory).toHaveBeenCalledWith("123", {
        name: "Old",
        slug: "old",
        label: "Old",
        status: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/blogcategory");
    });
  });

  it("shows toast error if fetch fails", async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: "bad" });
    mockFetchBlogCategoryById.mockResolvedValueOnce(null);

    render(<BlogCategoryFormTemplate />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to load Blog Category data"
      );
    });
  });

  it("shows toast error for backend 409 conflict", async () => {
    mockAddBlogCategory.mockRejectedValueOnce({
      response: { status: 409, data: { message: "already exists" } },
    });

    render(<BlogCategoryFormTemplate />);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("already exists");
    });
  });

  it("shows toast error for backend array errors", async () => {
    mockAddBlogCategory.mockRejectedValueOnce({
      response: { data: { errors: [{ path: "name", message: "Invalid" }] } },
    });

    render(<BlogCategoryFormTemplate />);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("name: Invalid");
    });
  });

  it("shows toast error for backend string error", async () => {
    mockAddBlogCategory.mockRejectedValueOnce("string error");

    render(<BlogCategoryFormTemplate />);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("string error");
    });
  });

  it("shows toast error for backend generic error", async () => {
    mockAddBlogCategory.mockRejectedValueOnce({ message: "generic error" });

    render(<BlogCategoryFormTemplate />);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("generic error");
    });
  });
});
