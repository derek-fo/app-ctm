# Mapa de Fronteiras Nativas
Data: 2026-09-29
Status: Rascunho (será commitado na Aula 0.4)

## Categoria A — JavaScript puro
Roda inteiramente na thread JS, sem acessar recursos nativos.

Tudo o que for apenas matemática, string, array ou lógica de interface sem hardware vai para a Categoria A.

| Funcionalidade | Justificativa |
|---|---|
| Cálculo de 1RM (Repetição Máxima) | O cálculo de estimativa (ex: fórmula de Brzycki) é puramente matemático. É executado instantaneamente de forma síncrona na **thread JS**, sem qualquer necessidade de acessar APIs do sistema operacional ou comunicação nativa. |
| Validação do formulário de rotina | As checagens de campos em branco, limites de carga ou formatação de dados são regras de negócio simples, resolvidas de forma rápida na **thread JS** antes de qualquer envio ou persistência. |
| Cálculo de estatísticas e histórico de treinos | A filtragem de arrays e agrupamento de dados do mês baseiam-se apenas em lógica e manipulação de variáveis, não requerendo acesso a hardware e mantendo o processamento exclusivo na **thread JS**. |

## Categoria B — JavaScript + módulo nativo sob demanda
Depende de um TurboModule/biblioteca nativa, mas a interação é pontual.

Tudo o que precisa do celular (câmera, arquivos, bluetooth) mas ocorre apenas "quando o usuário clica" vai para a Categoria B (usando JSI para chamadas síncronas/rápidas).

| Funcionalidade | Módulo nativo provável | Justificativa |
|---|---|---|
| Câmera para fotos de progresso | `expo-camera` ou `react-native-vision-camera` | A captura de imagem exige controle do hardware fotográfico. A **thread JS** faz uma chamada pontual ao lado nativo via **JSI / TurboModules** solicitando a ativação e, em seguida, aguarda a resposta com a foto. |
| Autenticação por Biometria | `expo-local-authentication` | Validações por FaceID/TouchID são fechadas por segurança no sistema operacional nativo. O JS apenas dispara a intenção usando um **TurboModule** e aguarda o resultado booleano de sucesso ou falha. |
| Feedback Tátil (Vibração ao concluir série) | `expo-haptics` | O acionamento do motor de vibração é um recurso de hardware nativo. Quando o usuário clica no botão, a **thread JS** dispara uma requisição rápida pela **JSI** para que o dispositivo vibre pontualmente. |
| Armazenamento local de treinos offline | `expo-sqlite` ou `WatermelonDB` | Persistir dados no sistema de arquivos requer APIs nativas (C++/Java/Obj-C). A comunicação ocorre sob demanda via **JSI** para garantir leitura e escrita rápidas de I/O na memória do dispositivo. |

## Categoria C — Sensível a tempo real ou segundo plano
Não pode depender da thread JS livre, ou precisa rodar com o app fechado.

Tudo o que trava a tela (animações complexas a 60 fps) ou que não pode morrer se o usuário bloquear a tela (GPS e Timer) precisa ser Categoria C (Thread de UI nativa ou serviços em background).

| Funcionalidade | Risco se depender da thread JS | Justificativa |
|---|---|---|
| Timer de descanso com app em segundo plano | O sistema operacional pausa e limita a **thread JS** quando o app sai da tela, atrasando o cronômetro ou impedindo que o alarme toque no tempo correto. | Precisa ser registrado no lado nativo (como *Foreground Service* no Android ou *Background Tasks* no iOS) para garantir que o timer continue rodando de forma confiável e dispare a notificação mesmo sem JS. | 

| Gravação de rota GPS com tela bloqueada | Perda severa de dados de pace e distância, já que a **thread JS** seria suspensa com a tela desligada durante a corrida. | Requer um serviço nativo de localização em segundo plano ouvindo as coordenadas via hardware em tempo real, independente do estado de vida do React Native. |
| Animação de arrastar (swipe) para concluir série | Se a **thread JS** estiver calculando métricas de treino ou fazendo requisições de rede, ocorrerão *drops* de frame e a animação ficará travada/lenta para o usuário. | Para garantir 60 FPS fluídos, a animação deve rodar puramente na **thread de UI**, interceptando os gestos do lado nativo (ex: Reanimated), sem que o tráfego dependa da disponibilidade da thread JS. |


*correções: 
Revisão do Mapa de Fronteiras Nativas

Você classificou 10 funcionalidades, e a maioria está na categoria certa. Gostei das regras que você mesmo escreveu no topo de cada categoria: é assim que um arquiteto transforma conhecimento em critério. Agora os ajustes, do mais importante ao menor.

1. Timer de descanso: categoria certa, mecanismo errado. Esse é o ponto mais valioso da revisão. Você não precisa de Foreground Service nem de Background Tasks para um timer de descanso, e as duas escolhas trariam problemas: o Google Play restringe o uso de foreground services, e as Background Tasks do iOS rodam quando o sistema quiser, não no segundo exato. A solução profissional (que faremos no Módulo 9) é outra: ao iniciar o descanso, você guarda o horário em que ele termina e agenda uma notificação local para aquele horário. Quem dispara o alarme é o próprio sistema operacional, sem nenhum código seu rodando. Quando o usuário volta ao app, você recalcula o tempo restante a partir do horário salvo. Guarde esta frase: o melhor código em segundo plano é aquele que não precisa rodar em segundo plano.

2. "Estatísticas e histórico" não é Categoria A. Duas razões. Primeiro, o histórico vem do banco local (SQLite), então buscar esses dados já exige um módulo nativo. Segundo, e mais importante: agrupar meses de treino num laço JavaScript é exatamente o cenário do seu Desafio, o que trava a tela. O correto é dividir em duas linhas: formatar e exibir estatísticas é Categoria A; consultar e agregar o histórico é Categoria B, feito no banco com SQL (Módulo 11).

3. JSI não significa "sempre síncrono". Na regra da Categoria B você escreveu "usando JSI para chamadas síncronas/rápidas". A JSI permite chamadas síncronas, mas a maioria dos módulos continua assíncrona, e por bons motivos. A biometria, por exemplo, abre uma tela do sistema e espera o usuário posicionar o dedo: se isso fosse síncrono, a thread JS ficaria bloqueada durante toda a espera. O ganho da JSI é eliminar a tradução para JSON e a fila de cartas, não tornar tudo instantâneo.

4. Câmera: um detalhe fino. A chamada para tirar a foto é pontual (Categoria B), mas a pré-visualização da câmera é uma view nativa atualizada o tempo todo na thread de UI, e os quadros de vídeo nunca passam pelo JavaScript. Vale mencionar isso na justificativa.

5. SQLite: disco, não memória. Na justificativa você escreveu "I/O na memória do dispositivo". O SQLite grava no armazenamento (disco). E um cuidado que já vale anotar: bibliotecas de banco costumam oferecer APIs síncronas e assíncronas. As síncronas bloqueiam a thread JS enquanto o disco trabalha, então no nosso app a padrão será a assíncrona.

6. GPS e swipe: corretos. Um único complemento no swipe: quem intercepta o gesto do lado nativo é o Gesture Handler, e quem anima na thread de UI é o Reanimated. Os dois trabalham juntos (Módulo 12).

Tarefa rápida: aplique essas correções no seu arquivo antes da Aula 0.4, quando ele será commitado. Escrever com suas palavras é o que fixa o conteúdo.