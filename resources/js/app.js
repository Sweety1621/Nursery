// jshint maxerr:10000
import axios from "axios";
import Toastr from "toastr";
import {initAdmin} from "./admin";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

// console.log(cartCounter);

function updateCart(plant) {
    axios.post("/update-cart", plant).then(res => {
        cartCounter.innerText = res.data.totQnty;
        Toastr.options.timeOut = 1;
        Toastr.success("Item added to cart");
    }).catch(err => {
        Toastr.options.timeOut = 1;
        Toastr.error("Something went wrong!");
    });
}

addToCart.forEach((btn)=> {
    btn.addEventListener("click", (e)=> {
        let plant = JSON.parse(btn.dataset.plant);
        updateCart(plant);
    });
});

// Remove alert msg after 'n' seconds
const alertMsg = document.querySelector("#success-alert");
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}

initAdmin();
