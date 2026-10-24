# Storyboard Studio Next v0.3.12 — Windows 10 / 11 (64 bits)

Este é o código-fonte **completo** da versão 0.3.12, adaptado para o Windows 10 x64 e pronto para compilar pelo **GitHub Actions**. A base do aplicativo continua sendo **Tauri 2 + Rust e HTML/CSS/JavaScript**, sem npm, Electron ou serviços online em execução no app.

## Como obter o instalador .exe pelo GitHub

1. Acesse a branch atualizada ou o merge do pull request. As pastas `src/`, `src-tauri/` e `scripts/` já estão no repositório, sem necessidade de extrair o ZIP antigo.
2. No GitHub, abra o repositório e clique em **Actions**.
3. Escolha **Storyboard Studio Next - Windows 10 x64** na coluna esquerda.
4. Clique em **Run workflow** e confirme. O build também inicia automaticamente quando forem enviados arquivos do código-fonte para a branch `main`.
5. Quando o job **Compilar instalador EXE (Windows x64)** estiver com marca de sucesso, abra a execução e encontre **Artifacts**, no final da página.
6. Baixe `Storyboard-Studio-Next-v0.3.12-Windows10-x64.zip`, extraia-o e execute o instalador `*-setup.exe` no Windows 10 (64 bits).

O GitHub fornece um executor **Windows Server 2022** para compilar o aplicativo Windows x64. Isso **não** obriga você a instalar o Windows Server: o resultado visa Windows 10/11 x64. A execução **precisa completar com sucesso** para que o .exe seja considerado gerado. Os arquivos em Artifacts ficam disponíveis por um período limitado, configurado aqui para 30 dias.

### Envio para o repositório oyayasu/storyboard

Destino: https://github.com/oyayasu/storyboard

**Opção 1 — Pelo navegador, sem Git instalado**

1. Extraia o ZIP de upload. Não envie o ZIP fechado.
2. Abra o repositório e clique em **Add file → Upload files**.
3. Arraste os arquivos e pastas da raiz extraída, incluindo `.github`, `src`, `src-tauri`, `scripts` e os arquivos Markdown.
4. Confirme o commit na branch `main`. Ao enviar o workflow e o código, o GitHub Actions inicia a compilação automaticamente.

**Opção 2 — Envio automatizado pelo Windows com Git instalado**

Na pasta extraída, execute **ENVIAR_PARA_GITHUB.bat**. O script usa o repositório acima e preserva o histórico remoto (não faz force push). Pode exigir login pelo Git Credential Manager e identidade Git para o commit.

Não publique o código caso ele contenha dados privados: o repositório de destino é **público**.

## O que mudou para o Windows

- Criado um ícone `.ico` Windows a partir do ícone original.
- Adicionada configuração NSIS para gerar instalador `.exe` por usuário (não exige privilégios de administrador na instalação normal).
- Adicionado workflow GitHub Actions com checagem dos arquivos, sintaxe JavaScript, testes de estado/autosalvamento e compilação Rust/Tauri com upload do instalador.
- Adicionado `Ctrl+Y` para refazer no Windows; `Ctrl+Shift+Z` e `Ctrl+Z` continuam disponíveis. A interface informa o uso de `Cmd/Ctrl` para multisseleção.
- Mantidos os arquivos do Mac, o projeto original e `src-tauri/Cargo.lock`.

## Dados e compatibilidade

**O ZIP de código-fonte não inclui projetos salvos.** Os projetos estão armazenados no computador em que você usou Storyboard Studio Next (metadados no armazenamento do WebView e mídias no IndexedDB). Na passagem do macOS para o Windows, **exporte os projetos como arquivos `.storyboardstudio` no Mac** e importe-os no novo aplicativo do Windows. Teste os arquivos exportados antes de apagar os originais.

Os recursos de Storyboard Mode, Project Browser, chapters, imagens, notas, exportação PDF/PNG e o estado da versão 0.3.12 continuam no código. O Perform Mode permanece com as limitações pré-existentes do projeto; a exportação MP4 ainda depende de suporte do WebView e não é garantida. Por segurança, o installer não migra nem exclui seus dados antigos.

**Windows 10:** Tauri usa Microsoft Edge **WebView2** para executar o frontend. Se não estiver instalado, o instalador tenta baixá-lo (é necessária conexão com a internet para essa etapa). A configuração usa o instalador NSIS pequeno, não inclui o pacote offline de 127 MB. Consulte: https://v2.tauri.app/distribute/windows-installer/

**Assinatura:** o instalador criado no GitHub não terá assinatura digital comercial; o Windows SmartScreen pode alertar que se trata de um editor desconhecido. Verifique a procedência do seu próprio build antes de executá-lo.

## Se a compilação falhar

Abra **Actions → execução com falha → windows-installer** para ver a etapa e o log. Os erros mais comuns são falhas temporárias no download de dependências Rust, e não necessariamente defeitos do código. Ao relatar um problema, forneça o trecho final do log da etapa em vermelho.

O GitHub Actions cria o arquivo instalável, mas **este pacote ainda não foi compilado nem testado dentro de um Windows 10 real**. Os testes locais cobrem validação de arquivos, sintaxe JavaScript, criação de projetos, persistência, Undo/Redo e empacotamento do código-fonte; a compilação nativa será realizada na execução do workflow.
