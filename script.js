// Carrega os dados do localStorage ao iniciar a página
window.onload = function () {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva.forEach(produto => {
        adicionarLinhaNaTabela(produto);
    });
    atualizarTotal();
};

function adicionarLista() {
    const nomeProduto = document.getElementById('nome_produto').value.trim();
    const quantidade = parseFloat(document.getElementById('quantidade_produto').value.trim());
    const valorUnitario = parseFloat(document.getElementById('valor_produto').value.trim());
    const tipo = document.getElementById('tipo_produto').selectedOptions[0].text;

    if (!nomeProduto || isNaN(quantidade) || quantidade <= 0 || isNaN(valorUnitario) || valorUnitario <= 0) {
        alert("Por favor, preencha corretamente todos os campos.");
        return;
    }

    const valorTotal = quantidade * valorUnitario;

    const novoProduto = {
        nomeProduto,
        quantidade,
        valorUnitario,
        valorTotal,
        tipo,
        confirmado: false
    };

    adicionarLinhaNaTabela(novoProduto);
    salvarNoLocalStorage(novoProduto);
    atualizarTotal();
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
        <td>R$ ${produto.valorUnitario.toFixed(2)}</td>
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
        atualizarTotal();
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
            produto.valorUnitario === produtoRemovido.valorUnitario &&
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
            produto.valorUnitario === produtoAtualizado.valorUnitario &&
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
    document.getElementById('valor_produto').value = '';
    document.getElementById('tipo_produto').selectedIndex = 0;
}

function atualizarTotal() {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    const total = listaSalva.reduce((soma, produto) => soma + produto.valorTotal, 0);
    document.getElementById('totalCompra').textContent = total.toFixed(2);
}
