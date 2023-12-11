var form = document.getElementById('addForm');
var productList = document.getElementById('products');

// creating a event listener for Adding items:
form.addEventListener('submit', addCandies);
function addCandies(e){
    e.preventDefault();
    // getting candies details from the form
    var productName = document.getElementById('inputProductName').value;
    var productDesc = document.getElementById('inputProductDescription').value;
    var productPrice = document.getElementById('inputProductPrice').value;
    var productQuantity = document.getElementById('inputProductQuantity').value;

    // Now creating a list item so we can add it on our page
    var li = document.createElement('li');
    li.className = 'list-group-item';

    var bigSpace = '  -  ';
    li.appendChild(document.createTextNode('Product Name: ' + productName));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode('Product Description: ' + productDesc));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode('Product Price: ₹' + productPrice));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode('Product Quantity: ' + productQuantity));
    
    // adding a data attribute to store the quantity
    li.dataset.quantity = productQuantity
    var buyOne = document.createElement('button');
    buyOne.className = 'buyonebutton';
    buyOne.appendChild(document.createTextNode('Buy One'))
    li.appendChild(buyOne)

    var buyTwo = document.createElement('button');
    buyTwo.className = 'buytwobutton';
    buyTwo.appendChild(document.createTextNode('Buy Two'))
    li.appendChild(buyTwo)

    var buyThree = document.createElement('button');
    buyThree.className = 'buythreebutton';
    buyThree.appendChild(document.createTextNode('Buy Three'))
    li.appendChild(buyThree)
    
    // Adding event listeners to update candy quantiy
    buyOne.addEventListener('click', function(){
        updateQuantity(li, 1);
    });

    buyTwo.addEventListener('click', function(){
        updateQuantity(li, 2);
    });

    buyThree.addEventListener('click', function(){
        updateQuantity(li, 3);
    });

    var productDetails = {
        productname: productName,
        productDescription: productDesc,
        productprice: productPrice,
        productquantity: productQuantity
    };
    console.log(productDetails)
    axios.post("http://localhost:3000/generalStore/add-product"
    , productDetails)
    .then((response) => {
        console.log(response)
    })
    .catch((err) => {
        console.log('Error response from server:', err.response);
    })
    

    productList.appendChild(li);
    console.log('candies are added!!!');
}

document.addEventListener('DOMContentLoaded', handlePageLoad);
function handlePageLoad() {
    axios.get("http://localhost:3000/generalStore/get-all-product")
        .then((response) => {
            showNewUserOnScreen(response.data.allProducts);
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);
        });
}

function showNewUserOnScreen(products) {
    document.getElementById('inputProductName').value = '';
    document.getElementById('inputProductDescription').value = '';
    document.getElementById('inputProductPrice').value = '';
    document.getElementById('inputProductQuantity').value = '';

    for (var i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(products[i])
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.quantity = product.productquantity;

        const childHTML = `
            Product Name: ${product.productname} - Product Description: ${product.productDescription} - Product Price: ₹${product.productprice} - Product Quantity: ${product.productquantity}
            <button class="buyonebutton">Buy One</button>
            <button class="buytwobutton">Buy Two</button>
            <button class="buythreebutton">Buy Three</button>
        `;

        li.innerHTML = childHTML;
        productList.appendChild(li);

        const buyOne = li.querySelector('.buyonebutton');
        const buyTwo = li.querySelector('.buytwobutton');
        const buyThree = li.querySelector('.buythreebutton');

        buyOne.addEventListener('click', function () {
            updateQuantity(product, li, 1);
        });

        buyTwo.addEventListener('click', function () {
            updateQuantity(product, li, 2);
        });

        buyThree.addEventListener('click', function () {
            updateQuantity(product, li, 3);
        });
    }
}
function updateQuantity(user, product, quantityChange) {
    var currentQuantity = parseInt(product.dataset.quantity, 10);
    var newQuantity = currentQuantity - quantityChange;

    if (newQuantity >= 0) {
        product.dataset.quantity = newQuantity;
        // Updating the text content of the existing item to reflect the new quantity
        product.childNodes[0].textContent = 'Product Name: ' + user.productname + ' - ';
        product.childNodes[2].textContent = 'Product Description: ' + user.productDescription + ' - ';
        product.childNodes[4].textContent = 'Product Price: ₹' + user.productprice + ' - ';
        product.childNodes[6].textContent = 'Product Quantity: ' + newQuantity;

        // Updating the candy's quantity on the crud crud
        var productDetails = {
            productname: user.productname,
            productDescription: user.productDescription,
            productprice: user.productprice,
            productquantity: newQuantity
        };


        axios.put(`http://localhost:3000/generalStore/update-product/${user.id}`, productDetails)
        .then((response) => {
            console.log('Product quantity updated on the server:', response);
        })
        .catch((err) => {
            console.error('Error updating product quantity on the server:', err);
        });

    } else {
        alert('Not enough products in the stock!!');
    }
}

