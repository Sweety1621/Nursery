// jshint esversion: 6
const order = require("../../../models/order");

function orderController() {
    return {
        index(req, res) {
            // ne=>not equal and populate will give every info for user having that id without password
            order.find({status: {$ne: "completed"}}, null, {sort: {"createdAt": -1}}).populate("customerId", -"password").exec((err, orders) => {
                if(req.xhr) {
                    return res.json(orders);
                }
                res.render("admin/orders");
            }); 
        }
    };
}

module.exports = orderController;