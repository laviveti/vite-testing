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
    screen.getByText(/lista vazia/i);
  });

  test("Deve adicionar um item à lista", async () => {
    // arrange
    const user = userEvent.setup();
    render(<Form />);
    const input = screen.getByRole("textbox", { name: "Adicione um item" });
    const button = screen.getByRole("button", { name: "Enviar" });
    const listItems = screen.queryAllByRole("listitem");
    // act
    expect(listItems[0]).toHaveTextContent("Lista vazia");

    await user.type(input, "Item 1");
    await user.click(button);
    // Assert
    expect(listItems).toHaveLength(1);
    screen.getByText("Item 1");
  });

  test('se as classes "hidden first-of-type:block" presentes na <li> estão condicionando sua exibição', async () => {
    // Arrange: Configuração do cenário inicial
    const user = userEvent.setup();
    render(<Form />);
    const ul = screen.getByRole("list");
    const input = screen.getByRole("textbox", { name: /adicione um item/i });

    // Assert inicial: Verifica se, inicialmente, o único item é o "Lista vazia"
    expect(ul.firstElementChild).toHaveTextContent("Lista vazia");

    // Act: Interação do usuário adicionando um novo item
    await user.type(input, "Item 1");
    await user.keyboard("{Enter}");

    // Assert final: Após adicionar o item, o primeiro <li> deve ser "Item 1"
    expect(ul.firstElementChild).toHaveTextContent("Item 1");
  });
});
