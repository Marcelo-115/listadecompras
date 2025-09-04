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

    if (!nomeProduto || isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, preencha corretamente os campos.");
        return;
    }

    const novoProduto = {
        nomeProduto,
        quantidade,
        valorUnitario: null,
        valorTotal: null,
        confirmado: false   // 👈 ADICIONADO
    };

    adicionarLinhaNaTabela(novoProduto);
    salvarNoLocalStorage(novoProduto);
    limparFormulario();
}

function adicionarLinhaNaTabela(produto) {
    const tabela = document.querySelector('table tbody');
    const novaLinha = document.createElement('tr');

    // Se já estiver confirmado, aplica estilo
    if (produto.confirmado) novaLinha.classList.add("confirmado");

    novaLinha.innerHTML = `
        <td>${produto.nomeProduto}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.valorUnitario !== null ? "R$ " + produto.valorUnitario.toFixed(2) : "--"}</td>
        <td>${produto.valorTotal !== null ? "R$ " + produto.valorTotal.toFixed(2) : "--"}</td>
        <td>
            <span class="confirmar">✅</span>
            <span class="editar">✏️</span>
            <span class="remover">🗑️</span>
        </td>
    `;

    aplicarEventosLinha(novaLinha, produto);
    tabela.appendChild(novaLinha);
}

function aplicarEventosLinha(linha, produto) {
    // Confirmar
    linha.querySelector('.confirmar').addEventListener('click', () => {
        produto.confirmado = !produto.confirmado; // alterna estado
        atualizarProdutoNoLocalStorage(produto);

        if (produto.confirmado) {
            linha.classList.add("confirmado");
        } else {
            linha.classList.remove("confirmado");
        }
    });

    // Editar
    linha.querySelector('.editar').addEventListener('click', () => {
        editarProduto(linha, produto);
    });

    // Remover
    linha.querySelector('.remover').addEventListener('click', () => {
        linha.remove();
        removerDoLocalStorage(produto);
        atualizarTotal();
    });
}


function editarProduto(linha, produto) {
    linha.innerHTML = `
        <td>${produto.nomeProduto}</td>
        <td><input type="number" value="${produto.quantidade}" min="1" id="editQtd"></td>
        <td><input type="number" value="${produto.valorUnitario ?? ''}" step="0.01" min="0" id="editValor"></td>
        <td>${produto.valorTotal !== null ? "R$ " + produto.valorTotal.toFixed(2) : "--"}</td>
        <td>
            <span class="salvar">✅</span>
            <span class="cancelar">❌</span>
        </td>
    `;

    // Salvar edição
    linha.querySelector('.salvar').addEventListener('click', () => {
        const novaQtd = parseFloat(linha.querySelector('#editQtd').value);
        const novoValor = parseFloat(linha.querySelector('#editValor').value);

        if (isNaN(novaQtd) || novaQtd <= 0 || isNaN(novoValor) || novoValor <= 0) {
            alert("Quantidade e Valor devem ser válidos.");
            return;
        }

        produto.quantidade = novaQtd;
        produto.valorUnitario = novoValor;
        produto.valorTotal = novaQtd * novoValor;

        atualizarProdutoNoLocalStorage(produto);

        linha.innerHTML = `
            <td>${produto.nomeProduto}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.valorUnitario.toFixed(2)}</td>
            <td>R$ ${produto.valorTotal.toFixed(2)}</td>
            <td>
                <span class="confirmar">✅</span>
                <span class="editar">✏️</span>
                <span class="remover">🗑️</span>
            </td>
        `;
        aplicarEventosLinha(linha, produto);
        atualizarTotal();
    });

    // Cancelar edição
    linha.querySelector('.cancelar').addEventListener('click', () => {
        linha.innerHTML = `
            <td>${produto.nomeProduto}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.valorUnitario !== null ? "R$ " + produto.valorUnitario.toFixed(2) : "--"}</td>
            <td>${produto.valorTotal !== null ? "R$ " + produto.valorTotal.toFixed(2) : "--"}</td>
            <td>
                <span class="editar">✏️</span>
                <span class="remover">🗑️</span>
            </td>
        `;
        aplicarEventosLinha(linha, produto);
    });
}

function salvarNoLocalStorage(produto) {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva.push(produto);
    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function removerDoLocalStorage(produtoRemovido) {
    let listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva = listaSalva.filter(p => p.nomeProduto !== produtoRemovido.nomeProduto);
    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function atualizarProdutoNoLocalStorage(produtoAtualizado) {
    let listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    listaSalva = listaSalva.map(p => (p.nomeProduto === produtoAtualizado.nomeProduto ? produtoAtualizado : p));
    localStorage.setItem("listaCompras", JSON.stringify(listaSalva));
}

function limparFormulario() {
    document.getElementById('nome_produto').value = '';
    document.getElementById('quantidade_produto').value = '';
}

function atualizarTotal() {
    const listaSalva = JSON.parse(localStorage.getItem("listaCompras")) || [];
    const total = listaSalva.reduce((soma, produto) => soma + (produto.valorTotal || 0), 0);
    document.getElementById('totalCompra').textContent = total.toFixed(2);
}
