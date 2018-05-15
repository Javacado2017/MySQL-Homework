//Imports the needed modules 
var mysql = require('mysql');
require('console.table');
var inquirer = require('inquirer');

//Global variables for general use
var idIndex = ''
var quantityBought = ''
var quantityRemaining = ''
var totalCost = ''

//Creates a connection object
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

//Creates a connection to the database
connection.connect(function(error){
    if(error){
        console.log('The following error occured while trying to connect to the Bamazon Store Front: ' + error.message);
        return;
    } 
    console.log('\n' + 'Welcome the Bamazon Store Front. The following products are currently listed for sale: \n')
});

//Lists the current products available and calls on bamazonPurchase() to make a purchase. 
function listProducts(){
    connection.query('SELECT * FROM products' , function (error, results){
        console.table(results);
        //Runs function to make a purchase
        bamazonPurchase(results);
    });
}
listProducts();


//Function to make a purchase
function bamazonPurchase(results) {

    //Asks the User what product and qty to purchase. 
    inquirer.prompt([
        {
            type: 'input',
            message: 'What would you like to purchase? Input product id and press enter to continue.',
            name: 'productID',
            //Validates that the Product ID exists in the database
            validate: function validateProductID(name) {   
                var productCheck = [];

                for (var i = 0; i < results.length; i++) {
                    var itemID = results[i].id
                    productCheck.push(itemID)
                };
                
                if (productCheck.includes(parseInt(name))) {
                //Stores values for later use
                idIndex = name
                return name !== '';
                } else {
                return 'Please input a valid Product ID from table above.';
                }
            }
        },
        {
            type: 'input',     
            message: 'How many units would you like to purchase? See table above, then press enter to make purchase.',
            name: 'purchaseQuantity',
            //Validates that the quantiy desired exists in the database
            validate: function validatePurchaseQuantity(name) {
                
                var quanityAvailable = results[(idIndex-1)].stocked_quantity
                
                if (quanityAvailable >= name) {
                //Stores values for later use
                quantityBought = name;
                quantityRemaining = quanityAvailable - quantityBought;
                return name !=='';
                } else {
                return 'Please input a quantity value based on what is avaialble in stock.';   
                }                
            }
        },

        //Confirms purchase. (Maybe I'll code this later.)

    ]).then(function(inputs) {
        //Calculates and stored the total cost of the purchase 
        totalCost = results[(idIndex-1)].price_$*quantityBought;

        //Gives summary to of purchase
        console.log('You purchased ' + quantityBought + ' units of ' + results[(idIndex-1)].product_name + ' at $' + 
        results[(idIndex-1)].price_$ + ' per unit. A total of $' + totalCost + ' was charged to your account. Thank you. Goodbye.');

        //Updates database with new quantity
        updateDatabase();
    });
}

//Function to update database and end connection
function updateDatabase(results) {
    connection.query('UPDATE products SET stocked_quantity = ' + quantityRemaining + ' WHERE id =' + idIndex, function(error, results){
        if (error) {
            console.log(error);
        } 
    });

    connection.end(function(error) {
        if (error) {
            console.log('The following error occured while trying to connect to MySQL ' + error.message);
        } 
    });
    

}




