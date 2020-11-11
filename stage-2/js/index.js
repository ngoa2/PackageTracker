'use strict';

function renderCollapse(coll) {
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}
let coll = document.getElementsByClassName('collapsible');
renderCollapse(coll);

function renderCard(card) {
    //has to render button
    const cardTemp = `<div class="package-item">
        <button type="button" class=collapsible>
            <div class="card-container">
                <div class="card-item">
                    <img src="./img/icon.png" alt="icon">
                </div>
                <div class="card-item">
                    <h2>Chegg</h2>
                    <p class="order-num">Order #: 2f2f2f2f2f2f2f</p>
                    <p class="total-spend">Total Spending: $19</p>
                </div>
            </div>
        </button>
        <div class="content">                                           
        <p>Items You Bought:</p>
        <ul class="item-list">
                <li>Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal</li>
                <li>Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal</li>
        </ul>
        </div>`;
    $('.package-container').append(cardTemp);
    $('h2').last().text(card.Company);
    $('.order-num').last().text('Order #:' + card.OrderNum);
    $('.total-spend').last().text('Total Spending: ' + card.totalSpending);

    //render list of items
    $('.item-list').last().html('');
    for (let i = 0; i < card['itemNames'].length; i++) {
        let li1 = $('<li></li>');
        li1.text(card.itemNames[i]);
        $('.item-list').last().append(li1);
    }
    renderCollapse($('.collapsible').last());
}

function renderCardList(results) {
    $('.package-container').html('');
    results.forEach((card) => {
        $('.package-container').append(renderCard(card));
    });
}

//function to render error for fetch
function renderError(err) {
    let flexItem = $('main');
    flexItem.append('<p class="alert alert-danger"></p>');
    $('.alert alert-danger').text(err.message);
}

//function fetch data for cards
function fetchCardData(data, orderstatus) {
    fetch(data)
        .then(function (response) {
            return response.json();
        })
        .then(function (d) {
            let orders = d.orders;
            if (orderstatus == 1) {
                orders = orders.filter(ord => ord['orderStatus'] == 1);
            } else if (orderstatus == 2) {
                orders = orders.filter(ord => ord['orderStatus'] == 2);
            } else if (orderstatus == 3) {
                orders = orders.filter(ord => ord['orderStatus'] == 3);
            }
            renderCardList(orders);
        })
        .catch(function (err) {
            renderError(err);
            console.error(err);
        });
}

fetchCardData("./data/data.json", 0);

//dropdown filter
$('#all').click(function () {
    fetchCardData("./data/data.json", 0);
});
$('#recently').click(function () {
    fetchCardData("./data/data.json", 1);
});
$('#shipped').click(function () {
    fetchCardData("./data/data.json", 2);
});
$('#delivered').click(function () {
    fetchCardData("./data/data.json", 3);
});

let navButton = document.getElementById("hamburger-menu");
navButton.addEventListener("click", navFunction);

function navFunction() {
    let x = document.getElementById("hamburgerLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function hideNav(size) {
    let x = document.getElementById("hamburgerLinks")
    if (size.matches) {
        x.style.display = "none";
    }
}

let screenSize = window.matchMedia("(min-width: 900px)");
screenSize.addListener(hideNav);