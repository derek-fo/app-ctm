# ADR-002: Usar NativeWind para estilização

- Data: 2026-10-05
- Status: Aceita

## Contexto
O app terá muitas telas com visual consistente (cores, espaçamentos, tipografia) e
precisará de modo escuro. Estilizar tudo com objetos de StyleSheet escritos à mão
tende a gerar valores soltos e inconsistentes entre telas.

## Alternativas consideradas
- StyleSheet puro: pró: Zero dependências, performance nativa máxima e totalmente imune a bugs de terceiros. / contra: Código verboso, estilos separados do markup e maior dificuldade para escalar um Design System ou temas escuros.
- NativeWind v4.2.7 (estável, Tailwind 3): pró: Totalmente estável para produção, sintaxe familiar e comunidade consolidada. / contra: Configuração trabalhosa (Babel/Metro), maior tempo de compilação e preso às limitações da versão antiga do Tailwind. 
- NativeWind v5 (release candidate): pró: Configuração muito mais simples, suporte às novidades do Tailwind v4 e arquitetura otimizada para melhor performance. / contra: Risco de bugs inesperados por ser versão candidata (RC) e documentação/suporte da comunidade ainda em construção.

## Decisão
Foi decidido adotar o **NativeWind v4.2.7**. A estabilidade e a segurança de uma versão consolidada pesaram mais do que a facilidade de configuração da v5 (ainda em RC). Preferimos investir tempo no setup manual agora para garantir um ambiente livre de bugs experimentais.

## Consequências
### Positivas
- Desenvolvimento mais ágil aplicando estilos direto no componente, suporte extremamente facilitado para modo escuro (dark mode) e padronização do Design System.
### Negativas
- A configuração envolve vários arquivos (Babel, Metro, Tailwind), e mudanças neles
  exigem reiniciar o Metro com `--clear`.
- Ficamos restritos temporariamente às limitações do Tailwind 3 e adicionamos uma camada extra de dependências no projeto.
- Uma migração futura para a v5 precisará de uma nova ADR.

## Observação
O uso do NativeWind fica bloqueado por regra de ESLint até a Aula 2.4, para que a base
(StyleSheet e Flexbox nativo) seja aprendida primeiro.