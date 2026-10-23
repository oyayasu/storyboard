# Storyboard Studio Next — envio inicial

Este repositório foi preparado para receber o código-fonte do **Storyboard Studio Next v0.3.11 para Windows 10 (x64)**.

## Como adicionar o código-fonte

1. Baixe o arquivo ZIP fornecido nesta conversa e **extraia-o** no Windows.
2. Nesta página do repositório, abra **Add file → Upload files**.
3. Arraste **o conteúdo da pasta extraída** (não o arquivo ZIP) para a área de upload, preservando as pastas `src/`, `src-tauri/`, `scripts/` e **`.github/workflows/`**.
4. Faça o commit na branch **main**.
5. Abra a aba **Actions** e selecione a execução automática **Storyboard Studio Next - Windows 10 x64**. A execução deve gerar um instalador NSIS `.exe` em **Artifacts**, caso seja concluída sem erros.

**Importante:** não envie apenas o ZIP fechado; o GitHub Actions precisa encontrar os arquivos diretamente na raiz do repositório.

Esta preparação **não** contém o código-fonte do aplicativo até você fazer o upload. Não há instalador disponível antes de uma compilação concluída com sucesso.

Consulte também `README_WINDOWS10.md` após enviar o projeto.
