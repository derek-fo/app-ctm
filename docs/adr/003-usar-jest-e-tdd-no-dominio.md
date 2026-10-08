# ADR-003: Usar Jest e TDD na camada de domínio

- Data: 2026-10-07
- Status: Aceita

## Contexto
O app terá muitas regras de negócio (1RM, pace, volume, recordes, datas). Erros nelas
geram métricas erradas, que o usuário percebe e que destroem a confiança no app.
As regras ficam em `src/domain/`, como funções puras, sem depender de React.

## Alternativas consideradas
- Testar manualmente rodando o app: pró: Nenhuma configuração inicial de ferramentas necessária, desenvolvimento inicial aparentemente mais rápido. / contra: Lento, repetitivo e altamente suscetível a erro humano (falsos positivos). Inviável para garantir a qualidade de cálculos complexos e regressões contínuas à medida que o aplicativo cresce.
- Jest com o preset jest-expo: pró: É o padrão oficial no ecossistema React Native/Expo. Possui ampla documentação, excelente suporte da comunidade e, embora comecemos pelo domínio, já deixa o terreno pronto e compatível para testar a camada de UI/componentes futuramente. / contra: Pode ser levemente mais lento na execução dos testes e mais verboso na configuração inicial se comparado a ferramentas exclusivas de Node (como o Vitest).
- Vitest: pró: mais rápido e moderno / contra: suporte limitado para testar
  componentes React Native, o que obrigaria a ter duas ferramentas no futuro.

## Decisão
Adotar o Jest (utilizando o preset jest-expo) como framework padrão de testes do projeto e aplicar a prática de TDD (Test-Driven Development) especificamente para a camada de domínio (src/domain/). As lógicas centrais do aplicativo — como cálculos de Pace, estimativas de 1RM e progressão de volume — serão construídas escrevendo os testes antes da implementação, garantindo que sejam funções puras, isoladas de qualquer dependência do React Native ou bibliotecas externas.

## Consequências
### Positivas
- Alta Confiabilidade: Garantia de que as métricas e dados de treino exibidos ao usuário estão matematicamente corretos, evitando a perda de confiança no app.

- Prevenção de Regressões: O conjunto de testes atuará como uma rede de segurança estruturada, permitindo refatorar fórmulas e lógicas de treino no futuro sem o medo de quebrar funcionalidades existentes.

- Design de Código Superior: O TDD forçará a separação de responsabilidades. Como a regra precisa ser testável sem renderizar telas, a lógica de negócio ficará naturalmente isolada da interface.

- Documentação Viva: Os próprios arquivos de teste servirão como especificações claras de como as fórmulas de corrida e musculação devem se comportar em diversos cenários (casos de sucesso e de borda).

### Negativas
- Curva de Aprendizado e Disciplina: Exigirá rigor da equipe de desenvolvimento para não pular a etapa de testes e escrever os testes antes da implementação (TDD).

- Esforço Inicial Maior: O tempo gasto nas tarefas de domínio será maior no curto prazo devido à escrita do teste e do código de produção de forma interativa.

- Manutenção de Configuração: Atualizações maiores do Expo ou do React Native podem exigir ajustes periódicos nas configurações de mock e ambiente do Jest.