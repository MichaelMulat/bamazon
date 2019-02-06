var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "ambessa",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showProductList();
    // purchaseItem();

});

function showProductList() {
    connection.query(
        "SELECT * FROM products", function (err, res) {
            for (i = 0; i < res.length; i++) {
                console.log(
                    "\nProduct ID: " + res[i].item_id +
                    "\nProduct Name: " + res[i].product_name +
                    "\nDepartment: " + res[i].department_name +
                    "\nPrice: $" + res[i].cost +
                    "\nIn Stock: " + res[i].stock_quantity +
                    "\n-------------------------------------- ");
            }
            console.log("\n")
            purchaseItem();
        }
    );
}

var purchaseItem = function () {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What would you like to buy? Please type in the item id"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like"
            }
        ]).then(function (answer) {
            // check if there are enough items in stock
            connection.query(
                "SELECT * FROM products WHERE ?",
                {
                    item_id: answer.id
                },
                function (err, res) {
                    var chosenItem = res[0];
                    // console.log(chosenItem.stock_quantity, parseInt(answer.quantity))
                    
                    // If the stock quantity is less than the requested amount 
                    if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                        console.log("I dont think we have that many in stock!")
                        buyAgain();
                    }
                    // Else update the value in the database
                    else {
                        var new_stock = (chosenItem.stock_quantity - parseInt(answer.quantity));
                        console.log("New stock quantity = " + new_stock)
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: new_stock
                                },
                                {
                                    item_id: answer.id
                                }
                            ], function (err) {
                                // Report that the sale hs been made
                                console.log("Thank you for your purchase.")
                                console.log("You will be charged a total of $" + (chosenItem.cost * parseInt(answer.quantity)))
                                buyAgain();
                                
                            }
                        );
                    }
                }
            )
        }
        )

};

function buyAgain(){
    inquirer
        .prompt({
            name: "buy_again",
            type: "confirm",
            message: "Would you like to keep shopping"
        }
      ).then(function(answer){
        if(answer.buy_again){
            showProductList();
        } else {
            console.log("OK! Thanks for shopping with bamazon!")
            connection.end();
        }
      })
}