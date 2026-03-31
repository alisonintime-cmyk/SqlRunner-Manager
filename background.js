// Ao clicar no ícone da extensão, abre a página completa
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("page.html") });
});
