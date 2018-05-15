//Imports the needed modules 
var mysql = require('mysql');
require('console.table');
var inquirer = require('inquirer');

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


//Lists the current products available
function listProducts(){
    connection.query('SELECT * FROM products' , function (error, results){
        console.table(results);        
        bamazonPurchase(results);
    });
}
listProducts();

var idIndex = ''
var quantityBought = ''
var quantityRemaining = ''
var totalCost = ''

//Function to make a purchase
function bamazonPurchase(results) {

    inquirer.prompt([
        {
            type: 'input',
            message: 'To purchase, input Product ID from above.',
            name: 'productID',
            validate: function validateProductID(name) {   
                var productCheck = [];

                for (var i = 0; i < results.length; i++) {
                    var itemID = results[i].id
                    productCheck.push(itemID)
                };
                
                if (productCheck.includes(parseInt(name))) {
                idIndex = name
                return name !== '';
                } else {
                return 'Please input a valid Product ID from table above.';
                }
            }
        },
        {
            type: 'input',     
            message: 'Input valid quantity.',
            name: 'purchaseQuantity',
            validate: function validatePurchaseQuantity(name) {
                
                var quanityAvailable = results[(idIndex-1)].stocked_quantity
                

                if (quanityAvailable >= name) {
                quantityBought = name;
                quantityRemaining = quanityAvailable - quantityBought;
                return name !=='';
                } else {
                return 'Please input a quantity value based on what is avaialble in stock.';   
                }                
            }
        },
//confirm purchase. If yes, make purchase and continue, if no,the rerun the script
    ]).then(function(inputs) {
        totalValue = results[(idIndex-1)].price_$*quantityBought;

        console.log('You just purchased ' + results[(idIndex-1)].product_name + ' at $' + 
        results[(idIndex-1)].price_$ + 'per unti for a total of $' + totalValue + '. Thank you. Goodbye.');

        updateDatabase();
    });
}

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




