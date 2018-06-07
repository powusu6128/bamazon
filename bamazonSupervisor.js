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
    head: ['department_id','department_name','product_sales','cost_overhead','total_sales']

});


bamazonSupervisor();

function bamazonSupervisor() {

    inquirer.prompt([{
            message: "What is the action to be performed ?",
            type: "checkbox",
            name: "topics",
            choices: ["Add a New Department", "View Revenue by Department"]

        }

    ]).then(function (input) {

        if (input.topics === "Add a New Department") {
            console.log("New Department added");
            add_new_dept();
        } else {
            console.log("View Revenue report");
            view_revenue_report();

        }

    })
}


function add_new_dept() {

    inquirer.prompt([{

            message: "What is the New Department Name?",
            type: "input",
            name: "department_name"

        },
        {

            message: "What is the New Department overhead?",
            type: "input",
            name: "cost_overhead"

        },

    ]).then(function (input) {

        // connect to database & // Make the db query

        queryStr = 'SELECT department_name FROM departments';

        connection.query(queryStr, function (err, data) {
            if (err) throw err;
            console.log(data);
            var depts = '';
            var a = '';
            for (i = 0; i < data.length; i++) {

                dept = data[i].department_name;

            }
            a = dept.indexOf(input.department_name);

            if (a === -1){

                // Create the insertion query string
                var queryStr = 'INSERT INTO bamazon2.departments SET ?';

                // Add new department to the db
                connection.query(queryStr, input, function (error, results) {
                    if (error) throw error;

                    console.log('New department has been added under dept ID ' + results.insertId + '.');
                    console.log("\n---------------------------------------------------------------------\n");

                    connection.end();

                });

            } else {
                console.log("Department already exists, No duplication allowed");
                connection.end()

            }

        });

    });

}

function view_revenue_report() {

    // connect to database. 
    // 
    // check if the dept name exists,
    // if no , then add , else display error msg.
    // close connection. 

    var queryStr = 'SELECT departments.department_id,departments.department_name, departments.overhead_costs,products.product_sales ,';
    queryStr += ' sum(products.product_sales - departments.overhead_costs) as total_sales';
    queryStr += ' FROM products inner join departments where products.department_name = departments.department_name group by department_name;';

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        if (data != '') {

            console.log('---------------------------------------------\n');
            console.log('  *** Revenue Report By Department *** ');
            console.log('---------------------------------------------\n');

            
            for (var i = 0; i < data.length; i++) {
            
                table.push([data[i].department_id,data[i].department_name,data[i].product_sales, data[i].cost_overhead, data[i].total_sales]);

            }
            console.log(table.toString());


        } else {
            console.log("Please contact sys adm for system issue");

        }

        connection.end();

    });


}