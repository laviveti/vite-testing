import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Testes do Button", () => {
  test("Deve renderizar corretamente", () => {
    render(<Button>Teste</Button>);
    screen.getByText("Teste");
  });
});
