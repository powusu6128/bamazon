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
// create customer table
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

    head: ['department_id', 'department_name', 'product_sales', 'cost_overhead', 'total_sales']

});


bamazonSupervisor();

function bamazonSupervisor() {

    inquirer.prompt([{
            message: "What is the action to be performed ?",

            type: "checkbox",

            name: "topics",

            choices: ["Add A New Department", "View Revenue Made By Each Department", "cancel"]

        }

    ]).then(function (input) {

        if (input.topics[0] === "Add A New Department") {

            console.log("--------New Department added----------");

            addNewDepartment();

        } else if (input.topics[0] === "View Revenue Made By Each Department") {

            console.log("-------Departmental Revenues--------------");

            showSalesMade();

        } else {

            console.log("---------cancelled---------");

            return connection.end();
        }


    })
}

function addNewDepartment() {

    inquirer.prompt([{

            message: "Enter New Department Name?",

            type: "input",

            name: "department_name"

        },
        {

            message: "Enter New Department overhead?",

            type: "input",

            name: "overhead_costs"

        },

    ]).then(function (input) {

        // connect to database & // Make the db query

        queryStr = 'SELECT department_name FROM departments';

        connection.query(queryStr, function (err, data) {

            // console.log(data);

            if (err) throw err;

            var depts = '';

            var a = '';

            for (i = 0; i < data.length; i++) {

                dept = data[i].department_name;

            }
            a = dept.indexOf(input.department_name);

            if (a === -1) {

                // Create the insertion query string
                var queryStr = 'INSERT INTO bamazon2.departments SET ?';

                // Add new department to the db
                connection.query(queryStr, input, function (error, results) {
                    if (error) throw error;

                    console.log('New department has been added under dept ID ' + results.insertId + '.');
                    console.log("\n---------------------------------------------------------------------\n");

                    endOperation();

                });

            } else {
                console.log("Department already exists, No duplication allowed");

                endOperation();

            }

        });

    });

}


function showSalesMade(){

    var queryStr = 'select departments.department_id,departments.department_name,departments.overhead_costs,products.product_sales,SUM(products.product_sales - departments.overhead_costs) as total_sales ';
    queryStr += 'from departments ';
    queryStr += 'inner join products on ';
    queryStr += 'departments.department_name = products.department_name ';
    queryStr += 'group by departments.department_id,departments.department_name,departments.overhead_costs,products.product_sales ';
    queryStr += 'ORDER BY total_sales DESC limit 10';

    connection.query(queryStr, function (err, data) {

        if (err) throw err;

        if (data != '') {

            console.log('---------------------------------------------\n');
            console.log('  *** Revenue Report By Department *** ');
            console.log('---------------------------------------------\n');

            for (var i = 0; i < data.length; i++) {

                table.push([data[i].department_id, data[i].department_name, data[i].product_sales, data[i].overhead_costs, data[i].total_sales]);

            }

            console.log(table.toString());


        } else {

            console.log("Sorry, you can't perform this operation!!!");
            endOperation();

        }

        endOperation();

    });

}

function endOperation() {
    connection.end()
}