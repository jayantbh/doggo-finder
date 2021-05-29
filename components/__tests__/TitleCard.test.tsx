import React from "react";
import { render } from "@testing-library/react";

import { TitleCard } from "../TitleCard";
import { WorkerContext } from "../../context/worker";

describe("TitleCard", () => {
  it("shows correct text for loading state", () => {
    const { getByText } = render(
      <WorkerContext.Provider
        value={{ tfState: TensorFlowState.LOADING, worker: null }}
      >
        <TitleCard />
      </WorkerContext.Provider>
    );
    expect(getByText("Powering up machine brains")).toBeInTheDocument();
  });

  it("shows correct text for loaded state", () => {
    const { getByText } = render(
      <WorkerContext.Provider
        value={{ tfState: TensorFlowState.SUCCESS, worker: null }}
      >
        <TitleCard />
      </WorkerContext.Provider>
    );
    expect(getByText("Upload an image to get started")).toBeInTheDocument();
  });

  it("shows correct text for failure state", () => {
    const { getByText } = render(
      <WorkerContext.Provider
        value={{ tfState: TensorFlowState.FAILURE, worker: null }}
      >
        <TitleCard />
      </WorkerContext.Provider>
    );
    expect(getByText("The machine failed to load")).toBeInTheDocument();
  });
});
