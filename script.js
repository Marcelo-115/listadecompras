// Carrega os dados do localStorage ao iniciar a página
window.onload = function () {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva.forEach(produto => {
        adicionarLinhaNaTabela(produto);
    });
};

function adicionarLista() {
    const nomeProduto = document.getElementById('nome_produto').value.trim();
    const quantidade = document.getElementById('quantidade_produto').value.trim();
    const unidade = document.getElementById('und_med').value;
    const tipo = document.getElementById('tipo_produto').selectedOptions[0].text;

    if (!nomeProduto || !quantidade || quantidade <= 0) {
        alert("Por favor, preencha corretamente todos os campos.");
        return;
    }

    const novoProduto = {
        nomeProduto,
        quantidade,
        unidade,
        tipo,
        confirmado: false // adicionando status de confirmação
    };

    adicionarLinhaNaTabela(novoProduto);
    salvarNoLocalStorage(novoProduto);
    limparFormulario();
}

function adicionarLinhaNaTabela(produto) {
    const tabela = document.querySelector('table tbody');
    const novaLinha = document.createElement('tr');

    if (produto.confirmado) {
        novaLinha.style.backgroundColor = 'rgba(0, 128, 0, 0.3)';
    }

    novaLinha.innerHTML = `
        <td>${produto.nomeProduto}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.unidade}</td>
        <td>${produto.tipo}</td>
        <td>
            <span class="remover">❌</span>
            <span class="confirmar">✅</span>
        </td>
    `;

    // Evento para remover produto
    novaLinha.querySelector('.remover').addEventListener('click', () => {
        novaLinha.remove();
        removerDoLocalStorage(produto);
    });

    // Evento para confirmar produto
    novaLinha.querySelector('.confirmar').addEventListener('click', () => {
        produto.confirmado = true;
        novaLinha.style.backgroundColor = 'rgba(0, 128, 0, 0.3)';
        atualizarProdutoNoLocalStorage(produto);
    });

    tabela.appendChild(novaLinha);
}

function salvarNoLocalStorage(produto) {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva.push(produto);
    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function removerDoLocalStorage(produtoRemovido) {
    let listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];

    listaSalva = listaSalva.filter(produto =>
        !(
            produto.nomeProduto === produtoRemovido.nomeProduto &&
            produto.quantidade === produtoRemovido.quantidade &&
            produto.unidade === produtoRemovido.unidade &&
            produto.tipo === produtoRemovido.tipo
        )
    );

    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function atualizarProdutoNoLocalStorage(produtoAtualizado) {
    let listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];

    listaSalva = listaSalva.map(produto => {
        if (
            produto.nomeProduto === produtoAtualizado.nomeProduto &&
            produto.quantidade === produtoAtualizado.quantidade &&
            produto.unidade === produtoAtualizado.unidade &&
            produto.tipo === produtoAtualizado.tipo
        ) {
            return produtoAtualizado;
        }
        return produto;
    });

    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function limparFormulario() {
    document.getElementById('nome_produto').value = '';
    document.getElementById('quantidade_produto').value = '';
    document.getElementById('und_med').selectedIndex = 0;
    document.getElementById('tipo_produto').selectedIndex = 0;
}
