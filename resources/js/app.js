// jshint maxerr:100000
import axios from "axios";
import Toastr from "toastr";
import {initAdmin} from "./admin";
import moment from "moment";

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


// Change order status
let statuses = document.querySelectorAll(".status-line");
console.log(statuses);
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
// console.log(order);
let time = document.createElement("small");


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove("step-completed");
        status.classList.remove("current");
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if(stepCompleted) {
            status.classList.add("step-completed");
        }
        if(dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format("hh:mm A");
            status.appendChild(time);
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add("current");
            }
        }
    });
}

updateStatus(order);

// Socket
let socket = io();                                 // connected from layout.ejs
initAdmin(socket);

// Join
if(order) {
    socket.emit("join", `order_${order._id}`);     // order_5454567687656gfgv7 .. like this..room name
}


let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath);
if(adminAreaPath.includes("admin")) {
    socket.emit("join", "adminRoom");              // only one room
}
 

socket.on("orderUpdated", (data) => {
    const updatedOrder ={ ...order };             // copied order object
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    // console.log(data);
    updateStatus(updatedOrder);
    Toastr.options.timeOut = 3;
    Toastr.success("Order updated");
});
