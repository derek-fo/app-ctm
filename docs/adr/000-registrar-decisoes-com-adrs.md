# ADR-000: Registrar decisões de arquitetura com ADRs

- Data: 2026-09-29
- Status: Aceita

## Contexto
O app-treino terá decisões técnicas de longo prazo (navegação, estado, banco local,
sincronização). Sem registro, o motivo de cada escolha se perde com o tempo.

## Alternativas consideradas
- Não documentar: rápido agora, caro depois.
- Wiki externa: fica desatualizada e separada do código.
- ADRs no repositório: versionadas junto com o código que explicam.

## Decisão
Registraremos decisões arquiteturais como ADRs em `docs/adr/`, numeradas em sequência
(`NNN-titulo-em-kebab-case.md`), seguindo o `template.md`. ADRs aceitas são imutáveis;
mudanças de decisão geram uma nova ADR que substitui a anterior.

## Consequências
### Positivas
- Histórico do raciocínio preservado e revisável em pull requests.
### Negativas
- Custo de alguns minutos por decisão importante.