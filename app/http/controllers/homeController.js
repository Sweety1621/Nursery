// jshint esversion: 6
// jshint esversion: 8
const Menu = require("../../models/menu");
function homeController() {
    // factory func
    return {
        // index: function () {  
        // }
        async index(req, res) {
            // Menu.find().then((plants)=>{
            //     console.log(plants);
            //     res.render("home", {plants: plants});
            // });

            const plants = await Menu.find(); //await works when function is async (asynchronous)
            // console.log(plants);
            return res.render("home", {plants: plants});
        }
    };
}

module.exports = homeController;