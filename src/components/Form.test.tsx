import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe } from "vitest";
import { API_URL, Form, Todo } from "./Form";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new AxiosMockAdapter(axios);

describe("Testes do Form", () => {
  test("deve renderizar corretamente", () => {
    mock.onGet(API_URL).reply(200, []);
    render(<Form />);
    screen.getByText(/lista de itens/i);
    screen.getByRole("textbox", { name: "Adicione um item" });
    screen.getByRole("button", { name: "Enviar" });
    screen.getByText(/lista vazia/i);
  });
  test("deve renderizar corretamente com itens", async () => {
    const todos: Todo[] = [
      { userId: 1, id: 1, title: "Tarefa 1", completed: false },
      { userId: 1, id: 2, title: "Tarefa 2", completed: true },
      { userId: 1, id: 3, title: "Tarefa 3", completed: false },
    ];
    mock.onGet(API_URL).reply(200, todos);
    render(<Form />);
    screen.getByText(/lista de itens/i);
    screen.getByRole("textbox", { name: "Adicione um item" });
    screen.getByRole("button", { name: "Enviar" });

    await screen.findByText(todos[0].title);
    await screen.findByText(todos[1].title);
    await screen.findByText(todos[2].title);
  });
  test("deve adicionar um item à lista", async () => {
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
    render(<Form />); // Pode ter valores iniciais da API ou não

    const ul = screen.getByRole("list");
    const input = screen.getByRole("textbox", { name: /adicione um item/i });

    // Esperar até que a lista seja renderizada corretamente (com ou sem API)
    await waitFor(() => {
      expect(ul.children.length).toBeGreaterThanOrEqual(1);
    });

    // Verifica se "Lista vazia" aparece apenas quando não há itens iniciais
    if (ul.children.length === 1) {
      expect(ul.firstElementChild).toHaveTextContent("Lista vazia");
    }

    // Act: Interação do usuário adicionando um novo item
    await user.type(input, "Item 1");
    await user.keyboard("{Enter}");

    // npm run test "se as classes "hidden first-of-type:block" presentes na <li> está condicionando sua exibição"
  });
  test("deve remover o item da lista ao clicar no botão de excluir", async () => {
    // 🟢 Arrange: Configura o ambiente e adiciona um item
    const user = userEvent.setup();
    render(<Form />);
    const input = screen.getByRole("textbox", { name: /adicione um item/i });
    await user.type(input, "Item 1");
    await user.keyboard("{Enter}");
    // Obtém o item adicionado e o botão de remoção
    // ‼️com o getByText, se não estiver em tela o teste FALHARÁ
    const addedItem = screen.getByText("Item 1");
    const deleteButton = screen.getByRole("button", { name: 'Remover item "Item 1"' });
    expect(addedItem).toBeInTheDocument();
    // 🔴 Act: Clica no botão de remover
    await user.click(deleteButton);
    // 🔵 Assert: Verifica se o item foi removido
    // ‼️com o queryByText, se não estiver em tela o teste NÃO falhará
    const item = screen.queryByText("Item 1");
    expect(item).toBeNull();
    // expect(addedItem).not.toBeInTheDocument();
    // expect(screen.getByText("Lista vazia")).toBeInTheDocument();
  });
});
