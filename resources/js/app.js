
// jshint maxerr:1000
import axios from "axios";
import Toastr from "toastr";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

console.log(cartCounter);

function updateCart(plant) {
    axios.post("/update-cart", plant).then(res => {
        cartCounter.innerText = res.data.totQnty;
        Toastr.success("Item added to cart");
        Toastr.options.timeOut = 1;
    }).catch(err => {
        Toastr.error("Something went wrong!");
        Toastr.options.timeOut =1;
    });
}

addToCart.forEach((btn)=> {
    btn.addEventListener("click", (e)=> {
        let plant = JSON.parse(btn.dataset.plant);
        updateCart(plant);
    });
});


