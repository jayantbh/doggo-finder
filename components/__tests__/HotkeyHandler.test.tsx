import React from "react";
import { render } from "@testing-library/react";
import userEvent, { specialChars } from "@testing-library/user-event";

import { HotkeyHandler } from "../HotkeyHandler";
import { waitFrame } from "../../utils/test-utils";

describe("HotkeyHandler", () => {
  it("handles one hotkey display", () => {
    const { getByText } = render(<HotkeyHandler hotkey="Escape" />);
    expect(getByText("Esc")).toBeInTheDocument();
  });

  it("handles multiple hotkey display", () => {
    const { getByText } = render(<HotkeyHandler hotkey={["Escape", "X"]} />);
    expect(getByText("Esc, X")).toBeInTheDocument();
  });

  it("handles one hotkey action", async () => {
    const action = jest.fn();

    render(<HotkeyHandler hotkey="Escape" onHotkey={action} />);

    userEvent.type(document.body, specialChars.escape);

    await waitFrame();
    expect(action).toHaveBeenCalled();
  });

  it("handles multiple hotkey action", async () => {
    const action = jest.fn();

    render(<HotkeyHandler hotkey={["Escape", "X"]} onHotkey={action} />);

    userEvent.type(document.body, specialChars.escape);
    await waitFrame();
    userEvent.type(document.body, "X");
    await waitFrame();

    expect(action).toHaveBeenCalledTimes(2);
  });
});
