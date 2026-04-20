let cmds = [];
let editing = null;

document.addEventListener("DOMContentLoaded", () => {
  // Botões principais
  document.getElementById("btnNovo").addEventListener("click", openModal);
  document.getElementById("btnCancelar").addEventListener("click", closeModal);
  document.getElementById("btnSalvar").addEventListener("click", save);
  document.getElementById("filter").addEventListener("input", render);
  document.getElementById("mSql").addEventListener("input", previewSQL);
  document.getElementById("theme").addEventListener("change", toggleTheme);

  document.getElementById("btnBackup").addEventListener("click", gerarBackup);
  document.getElementById("btnImport").addEventListener("click", () => {
    if (confirm("Importar backup irá APAGAR todos os comandos atuais. Deseja continuar?")) {
      document.getElementById("file").click();
    }
  });
  document.getElementById("file").addEventListener("change", importarBackup);

  loadCommands();
});

/* Tema */
function toggleTheme() {
  const theme = document.getElementById("theme").value;
  document.body.className = theme;
}

/* Modal */
function openModal() {
  editing = null;
  document.getElementById("modal").style.display = "flex";
  document.getElementById("mTitle").value = "";
  document.getElementById("mSql").value = "";
  document.getElementById("preview").textContent = "";
}
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* Preview SQL com highlight */
function previewSQL() {
  const sql = document.getElementById("mSql").value;
  const preview = document.getElementById("preview");
  preview.textContent = sql;
  if (window.Prism) Prism.highlightElement(preview);
}

/* Salvar */
function save() {
  const obj = {
    title: document.getElementById("mTitle").value.trim(),
    sql: document.getElementById("mSql").value.trim(),
  };
  if (!obj.title || !obj.sql) {
    showToast("Preencha título e SQL!");
    return;
  }
  if (editing === null) cmds.push(obj);
  else cmds[editing] = obj;

  // Usa salvarComandos para gravar em blocos
  salvarComandos();
  closeModal();
}
/* Carregar */
function loadCommands() {
  chrome.storage.sync.get(null, data => {
    cmds = [];
    Object.keys(data).forEach(k => {
      if (k.startsWith("sqlCommands_") && Array.isArray(data[k])) {
        cmds = cmds.concat(data[k]);
      }
    });
    render();
  });
}

/* Renderizar lista */
function render() {
  const f = document.getElementById("filter").value.toLowerCase();
  const list = document.getElementById("list");
  list.innerHTML = "";

  // Filtramos os comandos
  const filtered = cmds.filter(c => c.title.toLowerCase().includes(f) || c.sql.toLowerCase().includes(f));

  filtered.forEach((c) => {
    // IMPORTANTE: Pegamos o índice REAL do objeto dentro do array 'cmds' original
    const realIndex = cmds.indexOf(c); 

    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <div class="head">
        <span class="title">${c.title}</span>
      </div>
      <pre class="sql language-sql">${c.sql}</pre>
      <div class="actions">
        <button class="copy" data-i="${realIndex}">Copiar</button>
        <button class="edit" data-i="${realIndex}">Editar</button>
        <button class="del" data-i="${realIndex}">Excluir</button>
      </div>`;
    list.appendChild(d);
  });

  list.querySelectorAll("pre.sql").forEach(el => {
    if (window.Prism) Prism.highlightElement(el);
  });

  list.querySelectorAll(".copy").forEach(btn =>
    btn.addEventListener("click", e => copy(e.target.dataset.i))
  );
  list.querySelectorAll(".edit").forEach(btn =>
    btn.addEventListener("click", e => edit(e.target.dataset.i))
  );
  list.querySelectorAll(".del").forEach(btn =>
    btn.addEventListener("click", e => del(e.target.dataset.i))
  );
}

/* Ações */
function copy(i) {
  navigator.clipboard.writeText(cmds[i].sql).then(() => {
    showToast("Comando copiado!");
  });
}

function edit(i) {
  editing = i;
  document.getElementById("modal").style.display = "flex";
  document.getElementById("mTitle").value = cmds[i].title;
  document.getElementById("mSql").value = cmds[i].sql;
  document.getElementById("preview").textContent = cmds[i].sql;
  if (window.Prism) Prism.highlightElement(document.getElementById("preview"));
}

function del(i) {
  if (confirm("Deseja realmente excluir este comando?")) {
    cmds.splice(i, 1);
    salvarComandos(); // Reaproveita a lógica de salvar em blocos
    showToast("Comando excluído!");
  }
}

/* Gerar Backup */
function gerarBackup() {
  const blob = new Blob([JSON.stringify(cmds)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "comandos_backup.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup gerado!");
}

/* Importar backup */
function importarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      let arr = Array.isArray(parsed) ? parsed : parsed.sqlCommands;
      if (!Array.isArray(arr)) {
        showToast("Formato inválido de backup!");
        return;
      }

      cmds = arr; // atualiza array em memória

      // Usa salvarComandos para gravar em blocos
      salvarComandos();
      showToast("Backup importado! Comandos anteriores foram apagados.");
    } catch {
      showToast("Arquivo inválido!");
    }
  };
  reader.readAsText(file);
}

/* Função auxiliar para salvar em blocos */
function salvarComandos() {
  const chunkSize = 20;
  let obj = {};
  for (let i = 0; i < cmds.length; i += chunkSize) {
    obj["sqlCommands_" + (i / chunkSize)] = cmds.slice(i, i + chunkSize);
  }

  chrome.storage.sync.clear(() => {
    chrome.storage.sync.set(obj, () => {
      render();
    });
  });
}

/* Toast */
function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
