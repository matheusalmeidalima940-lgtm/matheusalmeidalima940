// Configure com dados verdadeiros antes de divulgar a campanha.
const CAMPAIGN = {
  pixKey: "SUA-CHAVE-PIX-AQUI",
  pixOwner: "NOME DO RESPONSÁVEL",
  whatsapp: "",
  goal: 10000
};
let selectedAmount = 25;
const amountButtons = document.querySelectorAll(".amount-option");
const customAmount = document.querySelector("#custom-amount");
const pixKey = document.querySelector("#pix-key");
const toast = document.querySelector("#toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function setAmount(value) {
  selectedAmount = Number(value);
  amountButtons.forEach(button => {
    const active = Number(button.dataset.amount) === selectedAmount;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  customAmount.value = "";
}
amountButtons.forEach(button => button.addEventListener("click", () => setAmount(button.dataset.amount)));
customAmount.addEventListener("input", () => {
  selectedAmount = Number(customAmount.value);
  amountButtons.forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
});
document.querySelector("#copy-pix").addEventListener("click", async () => {
  const key = CAMPAIGN.pixKey.trim();
  if (!key || key === "SUA-CHAVE-PIX-AQUI") {
    showToast("A chave Pix oficial ainda precisa ser configurada.");
    return;
  }
  if (!Number.isFinite(selectedAmount) || selectedAmount <= 0) {
    showToast("Escolha um valor de doação válido.");
    customAmount.focus();
    return;
  }
  try {
    await navigator.clipboard.writeText(key);
    showToast("Chave Pix copiada. Confira o nome do destinatário no banco antes de pagar.");
  } catch {
    showToast("Não foi possível copiar. Selecione e copie a chave Pix exibida.");
  }
});
pixKey.textContent = CAMPAIGN.pixKey;
document.querySelector("#year").textContent = new Date().getFullYear();
// O site não processa nem confirma pagamentos. O doador paga no próprio banco.