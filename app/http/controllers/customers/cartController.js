// jshint esversion: 6
function cartController() {
    return {

        index(req, res) {
            res.render("customers/cart");
        },
        update(req, res) {

            // Cart layout for session
            // let cart = {
            //     items: {
            //         plantId: {item: plantObject, qnty: 0}
            //     },
            //     totQnty: 0,
            //     totPrice: 0
            // };

            // 1st time creating cart 
            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totQnty: 0,
                    totPrice: 0
                };
            }

            let cart = req.session.cart;

            // Check if item doesn't exist in cart
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qnty: 1
                };
            }
            else {
                cart.items[req.body._id].qnty ++;
            }

            cart.totQnty ++;
            cart.totPrice += req.body.price;

            return res.json({totQnty: req.session.cart.totQnty});
        }

    };
}

module.exports = cartController;