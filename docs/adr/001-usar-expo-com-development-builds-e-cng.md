# ADR-001: Usar Expo com development builds e CNG

- Data: 2026-09-29
- Status: Aceita

## Contexto

O app de treinos depende de funcionalidades classificadas nas Categorias B e C do Mapa de Fronteiras Nativas. Algumas delas usam bibliotecas nativas que **não estão disponíveis no Expo Go**:

- **Armazenamento chave-valor de alta performance** (`react-native-mmkv`): usado para preferências e para persistir o estado da sessão de treino ativa.
- **Integração com plataformas de saúde** (HealthKit no iOS, Health Connect no Android): leitura de passos e frequência cardíaca, e escrita de treinos.
- **Câmera avançada** (`react-native-vision-camera`): candidata para fotos de progresso. A alternativa `expo-camera` existe no Expo Go; a escolha final será feita no Módulo 9.
- **Push remoto no Android** (`expo-notifications`): necessário para o feed social e o engajamento (Módulo 12), e não suportado no Expo Go.

Além disso, o app precisa de **configuração nativa própria**, que o Expo Go não permite customizar:

- **Localização em segundo plano** para gravar rotas de GPS com a tela bloqueada, o que exige permissões e modos de background declarados no `Info.plist` (iOS) e no `AndroidManifest.xml` (Android).
- **Texto de uso do Face ID** (`NSFaceIDUsageDescription`) com a descrição do nosso app.
- **Identidade do app**: bundle identifier, package, scheme de deep link, ícone e splash.

Restrições do ambiente de desenvolvimento: o app deve rodar em iOS e Android, e o desenvolvimento acontece em **Windows, sem acesso a um Mac**, com um celular Android como dispositivo principal de testes.

## Alternativas consideradas

### 1. React Native CLI
- **Pró:** controle total das pastas `ios/` e `android/`; qualquer biblioteca ou código nativo pode ser adicionado diretamente.
- **Contra:** os projetos nativos passam a ser mantidos à mão (Xcode, Gradle, CocoaPods), cada atualização de versão do React Native vira uma migração manual, e gerar builds de iOS exige um Mac, que não temos.

### 2. Expo usando apenas Expo Go
- **Pró:** zero configuração nativa; basta escanear o QR code e o app roda no celular, sem compilar nada.
- **Contra:** só funcionam as bibliotecas nativas embutidas no Expo Go; não é possível usar MMKV, integração com saúde ou push remoto no Android, nem customizar a configuração nativa ou a identidade do app.

### 3. Expo com development builds e CNG (Continuous Native Generation)
- **Pró:** qualquer biblioteca nativa pode ser usada; as pastas `ios/` e `android/` são geradas a partir do `app.config.ts` e dos config plugins (`npx expo prebuild`), então não mantemos projetos nativos à mão e as atualizações ficam mais simples; builds de iOS podem ser feitos na nuvem pelo EAS Build.
- **Contra:** o app deixa de "simplesmente abrir" no Expo Go; é preciso compilar e instalar um development build próprio em cada dispositivo, e recompilar sempre que o lado nativo mudar.

## Decisão

Vamos usar Expo com development builds e CNG. As pastas nativas serão geradas a partir do `app.config.ts` (tipado) e de config plugins, e os builds de iOS e Android serão produzidos com o EAS Build quando não puderem ser feitos localmente.

## Consequências

### Positivas
- Acesso a qualquer módulo nativo que o app precise (MMKV, integração com saúde, câmera, GPS em segundo plano, SQLite, biometria, Reanimated).
- Configuração nativa declarativa, tipada e versionada no `app.config.ts`, revisável em pull requests.
- Builds de iOS possíveis sem Mac e sem manter um projeto Xcode à mão, via EAS Build.

### Negativas
- **Recompilar a cada mudança nativa:** instalar ou atualizar uma biblioteca com código nativo, adicionar ou alterar um config plugin, ou mudar permissões, ícone, splash, scheme ou bundle identifier no `app.config.ts` exige um novo development build. Apenas mudanças em JavaScript/TypeScript e assets carregados pelo Metro continuam com Fast Refresh, sem recompilar.
- **Tempo de build:** cada build nativo leva minutos (localmente ou na fila do EAS Build), bem mais lento que abrir o Expo Go.
- **iOS depende de infraestrutura externa:** sem Mac, todo build de iOS passa pelo EAS Build; instalar em um iPhone físico exige uma conta Apple Developer paga e o registro dos dispositivos. O desenvolvimento diário acontecerá primeiro no Android.
- **Não editar `ios/` e `android/` à mão:** com CNG essas pastas são descartáveis e regeneradas pelo `prebuild`; qualquer ajuste nativo precisa virar configuração no `app.config.ts` ou um config plugin, senão se perde.
- **Distribuição do development build:** cada pessoa e cada dispositivo precisa ter instalado o build compatível com as versões nativas do projeto; um build desatualizado quebra ao carregar um JavaScript que espera um módulo nativo novo.

## Evidências

### 1. Levantamento de compatibilidade

Fonte: React Native Directory (reactnative.directory), consultado em 2026-09-29.

| Biblioteca | Funciona no Expo Go? | Observação |
| :--- | :--- | :--- |
| `react-native-mmkv` | **Não** | Exige binário próprio. |
| `react-native-health` | **Não** | Integração com HealthKit (iOS). |
| `react-native-vision-camera` | **Não** | Alternativa `expo-camera` disponível no Expo Go. |
| `react-native-maps` | **Sim** | Incluída no binário do Expo Go. |
| `expo-notifications` | **Parcial** | Notificações locais funcionam; push remoto no Android não é suportado no Expo Go desde o SDK 53. |

### 2. Tentativa prática

Foi feita uma tentativa de inicializar `react-native-mmkv` no Expo Go, via Expo Snack. O erro obtido foi:

> Unable to resolve module 'react-native-mmkv.js'

Esse erro ocorre na etapa de **resolução do bundler**, antes de qualquer código nativo ser carregado, e indica que o pacote JavaScript não foi encontrado. Portanto, a tentativa **não comprovou** a ausência do módulo nativo e **não é usada como evidência** desta decisão, que se apoia no levantamento acima.

### 3. Explicação técnica

O Expo Go é um binário pré-compilado, distribuído pelas lojas. Código nativo precisa estar compilado dentro do binário do app; o JavaScript não consegue adicioná-lo em tempo de execução, e as regras das lojas proíbem baixar código nativo executável depois da instalação. Por isso, bibliotecas com código nativo fora do conjunto embutido no Expo Go exigem um binário próprio, que é o development build.
