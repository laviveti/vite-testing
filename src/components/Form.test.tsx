import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe } from "vitest";
import { Form } from "./Form";

describe("Testes do Form", () => {
  test("Deve renderizar corretamente", () => {
    render(<Form />);
    screen.getByText(/lista de itens/i);
    screen.getByRole("textbox", { name: "Adicione um item" });
    screen.getByRole("button", { name: "Enviar" });
    screen.getByText(/nenhum item adicionado/i);
  });

  test("Deve adicionar um item à lista", async () => {
    // arrange
    const user = userEvent.setup();
    render(<Form />);
    const input = screen.getByRole("textbox", { name: "Adicione um item" });
    const button = screen.getByRole("button", { name: "Enviar" });
    const listItems = screen.queryAllByRole("listitem");
    // act
    expect(listItems[0]).toContainHTML("Nenhum item adicionado");

    await user.type(input, "Item 1");
    await user.click(button);
    // Assert
    expect(listItems).toHaveLength(1);
    screen.getByText("Item 1");
    expect(screen.queryByText("Nenhum item adicionado")).toBeFalsy();
  });
});
