interface RespostasAnamnese {
  idade: string;
  peso: string;
  altura: string;
  objetivo: string;
  nivelAtividade: string;
  restricoes: string;
  diasDisponiveis: string;
}

export async function gerarTreinoIA(respostas: RespostasAnamnese) {
  // TODO: Implementar integração com API de IA
  console.log('Gerando treino com base nas respostas:', respostas);
  return {
    // Retorno mockado por enquanto
    tipo: 'forca',
    duracao: 60,
    exercicios: []
  };
}