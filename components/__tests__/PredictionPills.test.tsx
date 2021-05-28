import React from "react";
import { render } from "@testing-library/react";
import { Prediction } from "../../types/types";
import { PredictionPill, PredictionPills } from "../PredictionPills";
import userEvent from "@testing-library/user-event";

const predictions: Prediction[] = [
  {
    className: "pekinese",
    link: "https://link.to/pekinese",
    probability: 0.5,
  },
  {
    className: "shihtzu",
    link: "https://link.to/pekinese",
    probability: 0.35,
  },
  {
    className: "labrador",
    link: "https://link.to/pekinese",
    probability: 0.15,
  },
];

describe("PredictionPills", () => {
  it("shows a list of predictions correctly", () => {
    const onSelect = jest.fn();

    const { getByText, getByTitle } = render(
      <PredictionPills
        predictions={predictions}
        loadingBreed={null}
        onSelect={onSelect}
      />
    );

    predictions.forEach((pred) => {
      expect(getByText(pred.className)).toBeInTheDocument();
    });

    expect(
      getByTitle("We're 50% sure the breed is pekinese")
    ).toBeInTheDocument();

    userEvent.click(getByText("shihtzu"));

    expect(onSelect).toHaveBeenCalledWith(predictions[1]);
  });
});

describe("PredictionPill", () => {
  it("shows a prediction correctly", () => {
    const pred = predictions[2];
    const onSelect = jest.fn();

    const { getByText } = render(
      <PredictionPill pred={pred} isLoading={false} onSelect={onSelect} />
    );

    expect(getByText(pred.className)).toBeInTheDocument();

    userEvent.click(getByText(pred.className));

    expect(onSelect).toHaveBeenCalledWith(pred);
  });
});
