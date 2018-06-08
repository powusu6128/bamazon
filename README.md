# bamazon/philip
Module one: Customer modules
Displaying the stock in the store initial data. 
The customer is limited to see only transactions related information that he/she needs.




The following information below is the corresponding data from the bamazon2 database



The customer application can be invoked using the below command line interface CLI.
$ node bamazonCustomer.js





For the other application one can follow similar suit as bamazonManager.js and bamazonSupervisor.js respectively.

2.    Customer request to place an order by entering item id and quantity to be purchased.
    


Current database status in terms of item with id=7 and quantity in stock has been reduced by 2.By ordering the stock quantity reduced from 25 to 23 and product sales is tally according by estimating the price by the quantity of products purchased by the customer.



Customer-cli


Note:
Error correction is also dealt with when the customer enters anything which is illegal like instead of a number they accidentally enters decimal or string.



Operation of application: Display store/site inventory (display screen shots of operation)
a. check if product exists in the inventory.
b. if there is sufficient/insufficient stock/inventory available to meet customer request.
c. Quantity of product to enter cannot be in fraction or decimals


Module two: Manager module
This module has 4 functions:
1.    View products for sale



2.    View low inventory



This is because there was no stock which the quantity is less than 5. To test for this, since ornaments as quantity of 9 we will place an order from the customer cli and come back to test for this again.

3.    Add inventory to existing stock/inventory


Now database item with id 12 quantity has change to 19


4.    Add brand new product all together




Module three: Supervisor module
This module has 2 functions.
1.    Create a new department.
2.    View product sales by department
Operations of module supervisor’s application.
a.    Create a new department.


b.    View products sales by department.



There is error correction if the supervisor makes any mistake that will check and help the supervisor to rectify the error before data can be push to that database. Some of the common error captured are entering an already existing department name. The application will notify you of duplicate department names.

For example: try and create a new department and try and add that same department name again.


