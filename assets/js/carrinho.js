const carrinho =
JSON.parse(
    localStorage.getItem('carrinho')
) || [];

const container =
document.getElementById(
    'carrinho-container'
);

const totalElement =
document.getElementById('total');

let total = 0;

carrinho.forEach(produto => {

    total += Number(produto.price);

    container.innerHTML += `

        <div class="card-carrinho">

            <img
            src="../assets/image/${produto.image}"
            alt="${produto.name}">

            <div class="info-produto">

                <h3>${produto.name}</h3>

                <p>
                    R$ ${produto.price}
                </p>

            </div>

        </div>

    `;
});

totalElement.innerHTML =
`Total: R$ ${total.toFixed(2)}`;