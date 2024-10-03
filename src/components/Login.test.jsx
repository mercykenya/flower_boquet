import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import BouquetBuilder from "./BouquetBuilder";
import Quiz from "./Quiz";
import App from "../App";

import { waitFor } from "@testing-library/react";

describe("Login", () => {
  it("should navigate to the BouquetBuilder page when the 'Build Your Own Bouquet' button is clicked", () => {
    render(
      <BrowserRouter>
        <Login />
        <BouquetBuilder />
      </BrowserRouter>
    );

    const buildBouquetButton = screen.getByText("Build Your Own Bouquet");
    fireEvent.click(buildBouquetButton);

    const appBarElement = screen.getByText("Need some help?");
    expect(appBarElement).toBeDefined();
  });
});