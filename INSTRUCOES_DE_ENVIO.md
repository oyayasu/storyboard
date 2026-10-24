# Envio do Storyboard Studio Next para GitHub

**Repositório:** https://github.com/oyayasu/storyboard

**Sem instalar Git:** extraia este ZIP; no GitHub, clique **Add file → Upload files**, arraste todo o conteúdo extraído incluindo a pasta `.github` e confirme o commit na branch `main`. Não envie o ZIP fechado.

**Com Git instalado:** execute `ENVIAR_PARA_GITHUB.bat` na pasta extraída. Ele busca o estado remoto, cria um commit e faz push sem force push. O login e o nome/e-mail do Git podem ser solicitados.

Depois acesse https://github.com/oyayasu/storyboard/actions para ver a compilação Windows 10 x64 e baixar o instalador em **Artifacts**, se concluída com sucesso.

**Atenção:** este repositório é público. O projeto não inclui projetos pessoais salvos, mas revise os arquivos antes de publicá-los. Não há instalador testado até que a compilação tenha êxito.
