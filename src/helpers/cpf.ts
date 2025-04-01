export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCPF = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos ou se todos são iguais (ex: 111.111.111-11)
  if (!/^\d{11}$/.test(cleanedCPF) || /^(\d)\1{10}$/.test(cleanedCPF)) {
    return false;
  }

  // Converte para array de números
  const cpfArray = cleanedCPF.split("").map(Number);

  // Função para calcular os dígitos verificadores
  const calculateDigit = (slice: number[]) => {
    const sum = slice.reduce((acc, value, index) => acc + value * (slice.length + 1 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calcula e verifica os dígitos verificadores
  const digit1 = calculateDigit(cpfArray.slice(0, 9));
  const digit2 = calculateDigit(cpfArray.slice(0, 10));

  return digit1 === cpfArray[9] && digit2 === cpfArray[10];
}
