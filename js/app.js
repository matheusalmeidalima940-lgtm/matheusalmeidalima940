// Personalize estes dados antes de publicar sua loja.
const WHATSAPP_NUMBER = "5511999999999"; // DDI + DDD + número, somente dígitos.
const DELIVERY_FEE = 0; // Valor em reais. Deixe 0 para combinar a taxa no WhatsApp.

const products = [
  {id:1,name:"Burger da Casa",description:"Pão brioche, burger artesanal, queijo e molho especial.",price:29.90,oldPrice:34.90,category:"Hambúrgueres",tag:"Mais pedido",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Cheese Bacon",description:"Queijo derretido, bacon crocante e molho da casa.",price:32.90,category:"Hambúrgueres",tag:"Favorito",image:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Batata Crocante",description:"Porção douradinha com tempero especial.",price:16.90,category:"Acompanhamentos",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Pizza da Galera",description:"Massa leve, queijo, tomate e manjericão fresco.",price:42.90,oldPrice:49.90,category:"Pizzas",tag:"Oferta",image:"https://images.unsplash.com/photo- pizza-1?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Pizza Pepperoni",description:"Pepperoni, queijo especial e molho artesanal.",price:48.90,category:"Pizzas",image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Açaí Tropical",description:"Açaí cremoso com banana e granola.",price:19.90,category:"Sobremesas",image:"https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Brownie com calda",description:"Brownie macio de chocolate para adoçar o dia.",price:14.90,category:"Sobremesas",tag:"Docinho",image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Refrigerante gelado",description:"Lata 350 ml, bem geladinha.",price:6.00,category:"Bebidas",image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=700&q=80"}
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let activeCategory = "Todos";
let searchTerm = "";
let cart = [];

const grid = document.querySelector("#product-grid");
const categoriesEl = document.querySelector("#categories");
const drawer = document.querySelector("#cart-drawer");
const backdrop = document.querySelector("#drawer-backdrop");
const toast = document.querySelector("#toast");

function renderCategories(){
  const categories = ["Todos",...new Set(products.map(product=>product.category))];
  categoriesEl.innerHTML = categories.map(category =>
    `<button class="category-chip ${activeCategory===category?"active":""}" data-category="${category}">${category}</button>`
  ).join("");
}

function renderProducts(){
  const filtered = products.filter(product=>{
    const matchesCategory = activeCategory==="Todos" || product.category===activeCategory;
    const matchesSearch = (product.name+" "+product.description+" "+product.category).toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = filtered.map(product=>`
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.tag?`<span class="product-tag">${product.tag}</span>`:""}</div>
      <div class="product-info"><h3>${product.name}</h3><p>${product.description}</p>
        <div class="product-bottom"><div><span class="price">${money(product.price)}</span>${product.oldPrice?`<span class="old-price">${money(product.oldPrice)}</span>`:""}</div>
        <button class="add-button" data-add="${product.id}" aria-label="Adicionar ${product.name}">+</button></div>
      </div>
    </article>`
  ).join("");
  document.querySelector("#empty-state").hidden = filtered.length!==0;
}

function addToCart(id){
  const item = cart.find(entry=>entry.id===id);
  if(item) item.quantity++;
  else cart.push({id,quantity:1});
  renderCart();
  showToast("Adicionado ao seu pedido! 💛");
}
function changeQuantity(id,amount){
  const item = cart.find(entry=>entry.id===id);
  if(!item) return;
  item.quantity += amount;
  if(item.quantity<=0) cart = cart.filter(entry=>entry.id!==id);
  renderCart();
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  const subtotal = cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#drawer-count").textContent = `(${count})`;
  document.querySelector("#cart-subtotal").textContent = money(subtotal);
  document.querySelector("#cart-total").textContent = money(subtotal+DELIVERY_FEE);
  document.querySelector("#delivery-fee").textContent = DELIVERY_FEE>0?money(DELIVERY_FEE):"A combinar";
  document.querySelector("#cart-empty").hidden = count>0;
  document.querySelector("#cart-footer").hidden = count===0;
  document.querySelector("#cart-items").innerHTML = cart.map(item=>{
    const product = products.find(p=>p.id===item.id);
    return `<div class="cart-row"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><span class="cart-price">${money(product.price*item.quantity)}</span><div class="quantity"><button data-change="${product.id}" data-amount="-1" aria-label="Diminuir">−</button><span>${item.quantity}</span><button data-change="${product.id}" data-amount="1" aria-label="Aumentar">+</button></div></div><button class="remove-item" data-remove="${product.id}" aria-label="Remover ${product.name}">×</button></div>`;
  }).join("");
}
function openCart(){
  drawer.classList.add("open");backdrop.classList.add("open");document.body.classList.add("drawer-open");drawer.setAttribute("aria-hidden","false");
}
function closeCart(){
  drawer.classList.remove("open");backdrop.classList.remove("open");document.body.classList.remove("drawer-open");drawer.setAttribute("aria-hidden","true");
}
let toastTimer;
function showToast(message){
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function checkout(){
  if(!cart.length) return;
  if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){
    showToast("Configure o número do WhatsApp em js/app.js");return;
  }
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  const lines=cart.map(item=>{
    const product=products.find(p=>p.id===item.id);
    return `• ${item.quantity}x ${product.name} — ${money(product.price*item.quantity)}`;
  });
  const total=subtotal+DELIVERY_FEE;
  const message=["Olá! Quero fazer este pedido:","",...lines,"",`Subtotal: ${money(subtotal)}`,`Entrega: ${DELIVERY_FEE>0?money(DELIVERY_FEE):"a combinar"}`,`Total parcial: ${money(total)}`,"","Pode confirmar a disponibilidade e o prazo de entrega?"].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
}

categoriesEl.addEventListener("click",event=>{
  const button=event.target.closest("[data-category]");
  if(!button)return;
  activeCategory=button.dataset.category;renderCategories();renderProducts();
});
grid.addEventListener("click",event=>{
  const button=event.target.closest("[data-add]");
  if(button)addToCart(Number(button.dataset.add));
});
document.querySelector("#cart-items").addEventListener("click",event=>{
  const change=event.target.closest("[data-change]");
  const remove=event.target.closest("[data-remove]");
  if(change)changeQuantity(Number(change.dataset.change),Number(change.dataset.amount));
  if(remove){cart=cart.filter(item=>item.id!==Number(remove.dataset.remove));renderCart();}
});
document.querySelector("#open-cart").addEventListener("click",openCart);
document.querySelector("#close-cart").addEventListener("click",closeCart);
backdrop.addEventListener("click",closeCart);
document.querySelector("#browse-menu").addEventListener("click",()=>{closeCart();document.querySelector("#cardapio").scrollIntoView({behavior:"smooth"});});
document.querySelector("#checkout").addEventListener("click",checkout);
document.querySelector("#search-toggle").addEventListener("click",()=>{
  const panel=document.querySelector("#search-panel");panel.classList.toggle("visible");
  if(panel.classList.contains("visible"))document.querySelector("#search-input").focus();
});
document.querySelector("#search-input").addEventListener("input",event=>{
  searchTerm=event.target.value.trim().toLowerCase();renderProducts();
});
document.querySelector("#clear-search").addEventListener("click",()=>{
  document.querySelector("#search-input").value="";searchTerm="";renderProducts();
});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart();});
document.querySelector("#year").textContent=new Date().getFullYear();
renderCategories();renderProducts();renderCart();