// scripts/doctor.ts
// Diagnóstico do ambiente de desenvolvimento.
// Uso: npx tsx scripts/doctor.ts
import { execSync } from "node:child_process";

type CheckStatus = "ok" | "fail";

interface CheckResult {
  name: string;
  status: CheckStatus;
  detail: string;
}

interface Check {
  name: string;
  // Cada verificação devolve um texto de detalhe em caso de sucesso,
  // ou lança um erro em caso de falha.
  run: () => string;
}

// Executa um comando no terminal e devolve a saída como texto.
// stdio 'pipe' captura a saída em vez de imprimi-la direto na tela.
function runCommand(command: string): string {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

// Primeira linha de um texto. O "?? text" cobre o caso de texto vazio,
// satisfazendo o TypeScript em modo strict.
function firstLine(text: string): string {
  return text.split(/\r?\n/)[0] ?? text;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não está definida`);
  }
  return value;
}

function listEmulators(): string {
  const output = runCommand("emulator -list-avds");
  if (output.length === 0) {
    throw new Error("Nenhum emulador (AVD) criado no Android Studio");
  }
  return output.split(/\r?\n/).join(", ");
}

const checks: Check[] = [
  { name: "Node.js", run: () => runCommand("node --version") },
  { name: "npm", run: () => runCommand("npm --version") },
  { name: "Git", run: () => runCommand("git --version") },
  // O "java -version" escreve no canal de erro (stderr); o 2>&1 o redireciona.
  {
    name: "Java (JDK)",
    run: () => firstLine(runCommand("java -version 2>&1")),
  },
  { name: "JAVA_HOME", run: () => requireEnv("JAVA_HOME") },
  { name: "ANDROID_HOME", run: () => requireEnv("ANDROID_HOME") },
  { name: "adb", run: () => firstLine(runCommand("adb --version")) },
  { name: "Emuladores", run: listEmulators },
  { name: 'Dispositivos', run: checkDevices },
];

// Converte a execução de uma verificação num resultado tipado, sem deixar
// um erro isolado derrubar o diagnóstico inteiro.
function executeCheck(check: Check): CheckResult {
  try {
    return { name: check.name, status: "ok", detail: check.run() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { name: check.name, status: "fail", detail: firstLine(message) };
  }
}

const results = checks.map(executeCheck);

for (const result of results) {
  const icon = result.status === "ok" ? "✅" : "❌";
  console.log(`${icon} ${result.name}: ${result.detail}`);
}

const failures = results.filter((result) => result.status === "fail").length;
console.log(
  failures === 0
    ? "\nAmbiente pronto."
    : `\n${failures} problema(s) encontrado(s).`,
);

// Código de saída diferente de zero sinaliza falha para scripts e CI (Módulo 13).
process.exitCode = failures === 0 ? 0 : 1;

// Os três estados possíveis de um dispositivo no adb.
type DeviceState = "device" | "unauthorized" | "offline";

interface ConnectedDevice {
  serial: string;
  state: DeviceState;
}

type DeviceState = 'device' | 'unauthorized' | 'offline';

interface ConnectedDevice {
  serial: string;
  state: DeviceState;
}

// Sua versão do TODO 1, apenas retornando a condição direto.
function isDeviceState(value: string): value is DeviceState {
  return value === 'device' || value === 'unauthorized' || value === 'offline';
}

function parseAdbDevices(output: string): ConnectedDevice[] {
  const devices: ConnectedDevice[] = [];
  const lines = output.split(/\r?\n/);

  // slice(1) pula a primeira linha: "List of devices attached".
  for (const line of lines.slice(1)) {
    // Pula linhas vazias.
    if (line.trim() === '') {
      continue;
    }

    // Cada linha é "serial<TAB>estado".
    const [serial, state] = line.split('\t');

    // Só guarda a linha se os dois pedaços existirem e o estado for válido.
    if (serial && state && isDeviceState(state)) {
      devices.push({ serial, state });
    }
  }

  return devices;
}

function checkDevices(): string {
  const devices = parseAdbDevices(runCommand('adb devices'));
  const ready = devices.filter((device) => device.state === 'device');

  if (ready.length === 0) {
    const hasUnauthorized = devices.some((device) => device.state === 'unauthorized');
    if (hasUnauthorized) {
      throw new Error('Celular conectado, mas não autorizado: aceite o pedido de depuração USB na tela do celular');
    }
    throw new Error('Nenhum dispositivo encontrado: ligue o emulador ou conecte o celular via USB');
  }

  return `Prontos: ${ready.map((device) => device.serial).join(', ')}`;
}