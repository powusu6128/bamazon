
var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');
var Table = require('cli-table');

// connect to the required database 
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
    head: ['Item_ID', 'Product Name', 'Department Name','Price','Stock Products','Product Sales']

});

promptManagerAction();

// promptManagerAction will present menu options to the manager and trigger appropriate logic

function promptManagerAction() {

	// Prompt the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					// This case should be unreachable
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		// console.log('User has selected: ' + JSON.stringify(input));

		// Trigger the appropriate action based on the user input
		if (input.option ==='sale') {
			display_products();
		} else if (input.option === 'lowInventory') {
			display_LowInventory();
		} else if (input.option === 'addInventory') {
			add_Inventory();
		} else if (input.option === 'newProduct') {
			create_NewProduct();
		} else {
			// This case should be unreachable
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}


// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// validateNumeric makes sure that the user is supplying only positive numbers for their inputs
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

// display all the products available. 

function display_products() {
	
	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

        console.log('.........................\n');
		console.log('*** Existing Inventory *** ');
		console.log('.........................\n');

		for (var i = 0; i < data.length; i++) {
			table.push([data[i].item_id,data[i].product_name,data[i].department_name,data[i].price,data[i].stock_quantity,data[i].product_sales])
		}
          console.log(table.toString());
          console.log("---------------------------------------------------------------------\n");
          connection.end();
	  	
	})
}

// Display Low Inventory . 
function display_LowInventory() {
	
	// Construct the db query string
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 5';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		
		if (err) throw err;

		if(!(data.stock_quantity <5)) {
			
			return console.log("Sorry,All stocks are up to capacity!")
		}
		
        console.log('.......................................\n');
		console.log('*** Low Inventory Items (below 100): *** ');
		console.log('.......................................\n');

		for (var i = 0; i < data.length; i++) {
            
            table.push([data[i].item_id,data[i].product_name,data[i].department_name,data[i].price,data[i].stock_quantity,data[i].product_sales]);

        }
        
        console.log(table.toString());

	  	console.log("---------------------------------------------------------------------\n");

		// End the database connection
		connection.end();
	})
}

//add inventory . 

function add_Inventory() {
	
	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {
		// console.log('Manager has selected: \n    item_id = '  + input.item_id + '\n    additional quantity = ' + input.quantity);

		var item = input.item_id;
		var addQuantity = input.quantity;

		// Query db to confirm that the given item ID exists and to determine the current stock_count
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			// If the user has selected an invalid item ID, data attay will be empty

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');

				addInventory();

			} else {
				var productData = data[0];

				console.log('Updating Inventory...');

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

				// Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');

					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

// createNewProduct will guide the user in adding a new product to the inventory
function create_NewProduct() {

	// Prompt the user to enter information about the new product
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateInteger
		}
	]).then(function(input) {
		// console.log('input: ' + JSON.stringify(input));

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}