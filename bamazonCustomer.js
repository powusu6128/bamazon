var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'bamazon2',
    socketPath: '/tmp/mysql.sock'
});

var table = new Table({
    chars: {
        'top': '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        'bottom': '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        'left': '║',
        'left-mid': '╟',
        'mid': '─',
        'mid-mid': '┼',
        'right': '║',
        'right-mid': '╢',
        'middle': '│'
    },
    head: ['Item_ID', 'Product_Name', 'Price']
});


function display_products() {

    // Construct the db query string
    queryStr = 'SELECT * FROM products';

    // Make the db query
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('...................\n');
        console.log('Existing Inventory Sales: ');
        console.log('...................\n');

        for (var i = 0; i < data.length; i++) {

            table.push([data[i].item_id,data[i].product_name,data[i].price ]);
            
        }
        console.log(table.toString());

        console.log("---------------------------------------------------------------------\n");

        //Prompt the user for item/quantity they would like to purchase
        promptUserPurchase();
    })
}


// This function check the user input for whole numbers.
function validateUserInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter whole number';
    }
}

// Prompt Users with the question and update stock accordingly

function promptUserPurchase() {

    inquirer.prompt([{
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item ID which you would like to purchase.',
            validate: validateUserInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Number of items you want to buy?',
            validate: validateUserInput,
            filter: Number
        }
    ]).then(function (input) {

        var item = parseInt(input.item_id);

        var quantity = parseInt(input.quantity);

        // Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {
            item_id: item
        }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                display_products();

            } else {

                var productData = data[0];

                var totalProduct_sales =0;

                // If the quantity requested by the user is in stock
                if (quantity <= productData.stock_quantity) {
                    console.log('Congratulations, the product you requested is in stock! Placing order!');

                    // Construct the updating query string
                    totalProduct_sales =((productData.price * quantity) + (productData.product_sales)).toFixed(2);
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ',product_sales = ' + totalProduct_sales + ' WHERE item_id = ' + item;
                    // console.log('updateQueryStr = ' + updateQueryStr);

                    // Update the inventory
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log("\n---------------------------------------------------------------------\n");
                        console.log('Your oder has been placed! Your total is: $' + productData.price * quantity);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");

                        // End the database connection
                        endPurchase();
                    });
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------------\n");

                    display_products();
                }
            }
        })
    })
}

function endPurchase(){ connection.end()}

// invoke the function 
display_products();