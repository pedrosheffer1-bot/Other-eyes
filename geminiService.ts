// geminiService.ts

export const getFinancialAdvice = async (transactions: any[], goals: any[]) => {
  // Simula um tempo de pensamento da IA (1.5 segundos)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Lista de conselhos aleatórios para teste
  const advices = [
    "Analise seus gastos com alimentação, parecem estar acima da média.",
    "Ótimo progresso! Tente guardar 15% da sua renda este mês.",
    "Cuidado com os pequenos gastos diários, eles somam muito no final.",
    "Que tal revisar suas assinaturas mensais para cortar custos?",
    "Mantenha o foco! Você está construindo um futuro sólido."
  ];

  // Retorna um conselho aleatório
  return advices[Math.floor(Math.random() * advices.length)];
};
