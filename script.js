const produtos = [
  { id: 1, nome: "Camisa", preco: 50 },
  { id: 2, nome: "Tênis", preco: 120 },
  { id: 3, nome: "Boné", preco: 30 }
];

const CHAVE_CARRINHO = "carrinho";

const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// Cada item do carrinho guarda o id do produto e a quantidade: [{ id: 1, quantidade: 2 }]
let carrinho = carregarCarrinho();

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];

    // Versões antigas salvavam um produto inteiro por clique; aqui elas viram quantidades.
    const itens = [];
    salvo.forEach(item => {
      const quantidade = item.quantidade || 1;
      const existente = itens.find(i => i.id === item.id);
      if (existente) {
        existente.quantidade += quantidade;
      } else if (buscarProduto(item.id)) {
        itens.push({ id: item.id, quantidade });
      }
    });
    return itens;
  } catch (erro) {
    return [];
  }
}

function salvarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function buscarProduto(id) {
  return produtos.find(p => p.id === id);
}

function adicionar(id) {
  const item = carrinho.find(i => i.id === id);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id, quantidade: 1 });
  }
  atualizar();
}

function diminuir(id) {
  const item = carrinho.find(i => i.id === id);
  item.quantidade--;
  if (item.quantidade === 0) {
    remover(id);
    return;
  }
  atualizar();
}

function remover(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  atualizar();
}

function esvaziar() {
  carrinho = [];
  atualizar();
}

function criarBotao(texto, rotulo, classe, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.className = classe;
  botao.setAttribute("aria-label", rotulo);
  botao.addEventListener("click", acao);
  return botao;
}

function listarProdutos() {
  const lista = document.getElementById("produtos");

  produtos.forEach(produto => {
    const cartao = document.createElement("article");
    cartao.className = "produto";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.className = "preco";
    preco.textContent = formatoMoeda.format(produto.preco);

    const botao = criarBotao("Adicionar", `Adicionar ${produto.nome} ao carrinho`, "botao", () => adicionar(produto.id));

    cartao.append(nome, preco, botao);
    lista.append(cartao);
  });
}

function atualizar() {
  salvarCarrinho();

  const lista = document.getElementById("carrinho");
  lista.replaceChildren();

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(item => {
    const produto = buscarProduto(item.id);
    const subtotal = produto.preco * item.quantidade;
    total += subtotal;
    quantidadeTotal += item.quantidade;

    const linha = document.createElement("li");
    linha.className = "item";

    const info = document.createElement("div");
    info.innerHTML = `<strong></strong><span></span>`;
    info.querySelector("strong").textContent = produto.nome;
    info.querySelector("span").textContent = `${item.quantidade} × ${formatoMoeda.format(produto.preco)} = ${formatoMoeda.format(subtotal)}`;

    const controles = document.createElement("div");
    controles.className = "controles";
    controles.append(
      criarBotao("−", `Diminuir quantidade de ${produto.nome}`, "botao-icone", () => diminuir(item.id)),
      criarBotao("+", `Aumentar quantidade de ${produto.nome}`, "botao-icone", () => adicionar(item.id)),
      criarBotao("Remover", `Remover ${produto.nome} do carrinho`, "botao-remover", () => remover(item.id))
    );

    linha.append(info, controles);
    lista.append(linha);
  });

  document.getElementById("total").textContent = formatoMoeda.format(total);
  document.getElementById("contador").textContent = quantidadeTotal;
  document.getElementById("carrinho-vazio").hidden = carrinho.length > 0;
  document.getElementById("esvaziar").hidden = carrinho.length === 0;
}

document.getElementById("esvaziar").addEventListener("click", esvaziar);

listarProdutos();
atualizar();
