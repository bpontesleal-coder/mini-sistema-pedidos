const produtos = [
  { id: 1, nome: "Camisa", preco: 50 },
  { id: 2, nome: "Tênis", preco: 120 },
  { id: 3, nome: "Boné", preco: 30 }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function listarProdutos() {
  const div = document.getElementById("produtos");
  div.innerHTML = "";

  produtos.forEach(p => {
    div.innerHTML += `
      <div class="produto">
        <p>${p.nome}</p>
        <p>R$ ${p.preco}</p>
        <button onclick="adicionar(${p.id})">Adicionar</button>
      </div>
    `;
  });
}

function adicionar(id) {
  const produto = produtos.find(p => p.id === id);
  carrinho.push(produto);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  atualizarCarrinho();
}

function remover(index) {
  carrinho.splice(index, 1);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const ul = document.getElementById("carrinho");
  const totalEl = document.getElementById("total");

  ul.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    ul.innerHTML += `
      <li>
        ${item.nome} - R$ ${item.preco}
        <button onclick="remover(${index})">❌</button>
      </li>
    `;
    total += item.preco;
  });

  totalEl.innerText = "Total: R$ " + total;
}

listarProdutos();
atualizarCarrinho();