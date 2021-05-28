import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { FC, useContext } from "react";
import { Toast, ToastContext, ToastType } from "../../toast-context";
import { ToastProvider } from "../ToastProvider";

const toast = {
  id: 1e3,
  content: "Hello world 1",
  type: ToastType.SUCCESS,
};

const TestComponent: FC = () => {
  const { addToast } = useContext(ToastContext);

  return <button onClick={() => addToast(toast)}>Trigger toast</button>;
};

describe("ToastProvider", () => {
  it("shows a few toasts correctly", () => {
    const { getByText, queryByText, getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(queryByText("Hello world 1")).not.toBeInTheDocument();
    userEvent.click(getByText("Trigger toast"));

    expect(getByText("Hello world 1")).toBeInTheDocument();

    userEvent.click(getByTestId("cross"));
    expect(queryByText("Hello world 1")).not.toBeInTheDocument();
  });
});
