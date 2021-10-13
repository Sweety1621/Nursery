// jshint esversion: 6
// jshint esversion: 8
const Order = require("../../../models/order");
const moment = require("moment");

function orderController () {
    return {
        store(req, res) {
            // console.log(req.body); => will give empty object if there is no name attributr in input
             
            // Validate request
            const { phone, address } = req.body;
            if(!phone || !address) {
                req.flash("error", "All fields are required");
                return res.redirect("/cart");
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address
            });

            order.save().then(result => {
                Order.populate(result, {path: "customerId"}, (err, placedOrder) => {
                    req.flash("success", "Order placed successfully");
                    // Emit event
                    const eventEmitter = req.app.get("eventEmitter");
                    eventEmitter.emit("orderPlaced", placedOrder);
                    delete req.session.cart;
                    return res.redirect("/customer/orders");
                });

            }).catch(err => {
                req.flash("error", "Something went wrong");
                // console.log(err);
                return res.redirect("/cart");
            });

        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null, {sort: {"createdAt": -1}});
            // console.log(orders);

            res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");  // to dlt cache 

            res.render("customers/orders", {orders: orders, moment: moment});
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id);
            // Authorize user: so that others can't see other's order by putting some id
            if(req.user._id.toString() === order.customerId.toString()) {       // object to string
                // res.render("customer/singleOrder", {order: order});
                return res.render("customers/singleOrder", {order});                   // coz key and value r same
            }
            return res.redirect("/");
        }
    };
}

module.exports = orderController;