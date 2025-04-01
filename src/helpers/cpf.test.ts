import { isValidCPF } from "./cpf";

describe("CPF", () => {
  it("Deve ser valido", () => {
    const validCpf = "992.012.210-61";
    expect(isValidCPF(validCpf)).toBe(true);
  });
  it("Deve ser invalido", () => {
    // arrange - (preparação do teste)
    const invalidCpf = "123.456.789-00";
    // act - (execução do teste)
    const result = isValidCPF(invalidCpf);
    // assert - (verificação do teste)
    expect(result).toBe(false);
  });
});
