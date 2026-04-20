# SqlRunner Manager

Gerenciador de Comandos SQL para Microsoft Edge.  
Permite criar, editar, copiar, excluir e organizar comandos SQL com destaque de sintaxe e suporte a backup/importação.

---

## 📦 Instalação

1. Baixe e extraia o arquivo `SqlRunner Manager.zip` em uma pasta no seu computador (ex.: `C:\SqlRunner Manager`).
   <img width="953" height="788" alt="image" src="https://github.com/user-attachments/assets/92db0d64-7634-44b2-8706-4f49b6640c2c" />
3. Abra o navegador **Microsoft Edge**.
4. Vá em **Menu (⋮) → Extensões → Gerenciar extensões**.
5. Ative o **Modo desenvolvedor** (canto inferior esquerdo).
6. Clique em **Carregar sem compactação**.
7. Selecione a pasta onde você extraiu os arquivos.

A extensão será carregada e aparecerá na barra de ferramentas do Edge.

---

## 🚀 Uso

- **Novo comando** → Crie um SQL com título e conteúdo.
- **Editar/Excluir** → Gerencie comandos existentes.
- **Copiar** → Copie rapidamente o SQL para a área de transferência.
- **Filtrar** → Pesquise comandos pelo título ou conteúdo.
- **Backup** → Exporte todos os comandos em JSON.
- **Importar Backup** → Restaure comandos salvos anteriormente.
- **Tema** → Alterne entre claro e escuro.
- **Destaque de sintaxe** → Visualize SQL com cores usando Prism.

---

## 📂 Estrutura de Arquivos

- `manifest.json` → Configuração da extensão.
- `page.html` → Interface principal.
- `page.js` → Lógica da aplicação.
- `popup.css` → Estilos visuais.
- `icon.png` → Ícone da extensão.
- `libs/prism/` → Biblioteca Prism para destaque de sintaxe.

---

## ⚠️ Observações

- Esta extensão é carregada manualmente (modo desenvolvedor).  
- Para atualizar, substitua os arquivos na pasta e recarregue no Edge.  
- Para compartilhar, distribua o arquivo `SqlRunner Manager.zip` e siga o mesmo processo de instalação.

---

## ✨ Autor
Desenvolvido por Alison.
