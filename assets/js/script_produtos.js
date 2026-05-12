
let produtos = [];

async function carregarProdutos() {

    const response = await fetch(
        'http://localhost:3000/products'
    );

    const data = await response.json();

    produtos = data;

    const grid = document.getElementById(
        'grid-produtos'
    );

    produtos.forEach(produto => {

        grid.innerHTML += `

            <div class="card-produto">

                <img src="../assets/image/camisas/${produto.image}">

                <h3>${produto.name}</h3>

                <p class="preco">
                    R$ ${produto.price}
                </p>

                <button onclick="adicionarCarrinho(${produto.id})">
                    Comprar
                </button>

            </div>

        `;
    });
}

carregarProdutos();

    function adicionarCarrinho(id) {

        const produto = produtos.find(
            p => p.id === id
        );

        let carrinho =
            JSON.parse(
                localStorage.getItem('carrinho')
            ) || [];

        carrinho.push(produto);

        localStorage.setItem(
            'carrinho',
            JSON.stringify(carrinho)
        );

        alert('Produto adicionado!');

        atualizarCarrinho();
    }

    function atualizarCarrinho() {

    const carrinho =
        JSON.parse(
            localStorage.getItem('carrinho')
        ) || [];

    document.getElementById(
        'contador-carrinho'
    ).innerText = carrinho.length;
}

atualizarCarrinho();
