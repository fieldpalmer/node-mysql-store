//retrieve dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
//establish mysql database connection
const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: '',
   database: 'bamazon'
})
// app functions
const openStore = () => {
   // display all available items in mySQL database
   connection.query('SELECT * FROM products', function(err, res) {
      if (err) throw err;
      console.log(
         '\nWELCOME TO BAMAZON\n' +
         '--------------------------------\n' +
         'Items in Stock:\n' +
         '--------------------------------\n'
      );
      for (var i = 0 ; i < res.length ; i++) {
         console.log(
            'Item ID: ' + res[i].item_id +  
            '\nProduct Name: ' + res[i].product_name +  
            '\nDepartment Name: ' + res[i].department_name +  
            '\nPrice: $' + res[i].price + 
            '\nUnits Available: ' + res[i].stock_quantity + 
            '\n************************\n'
         );
      }
      console.log('--------------------------------');
      promptPurchase();
   })
}

const promptPurchase = () => {
   // get info from user on what they want
   inquirer.prompt([
      {
            name: 'item_id',
            type: 'input',
            message: 'What is the ID of the product you would like?',
            validate: (value) => {
                  if (!isNaN(value) && value > 0) {
                  return true;
                  } else {
                  console.log("Uh oh, we're noticing some suspicious activity");
                  return false;
                  }
            }  
      },
      {
            name: 'amount',
            type: 'input',
            message: 'How many do you need?',
            validate: (value) => {
                  if (!isNaN(value) && value > 0) {
                  return true;
                  } else {
                  console.log("Uh oh, we're noticing some suspicious activity");
                  return false;
                  }
            }
      }
   ]).then(function(answer) {
      //save user inputs in variables
      let product = answer.item_id;
      let quantity = answer.amount;
      //connect with mysql to get more info on selected product
      connection.query('SELECT * FROM products WHERE ?', {item_id:product}, function(err, res) {
         if (err) throw err;
            let productData = res[0];
            if (productData.stock_quantity >= quantity) { //make sure there's enough stock to purchase
               //use inquirer to confirm with customer their order is correct y/n
               inquirer.prompt([
                  {
                     name: 'orderConfirm',
                     type: 'confirm',
                     message: 'Please confirm your order:\n------------------------\nProduct ID: ' + productData.item_id + 
                        '\nProduct Name: ' + productData.product_name + 
                        '\nQuantity Requested: ' + quantity + 
                        '\nPrice / Unit: ' + productData.price + 
                        '\n------------------------------' +
                        '\nDo you wish to proceed with placing the order'
                  }
               ]).then(function(response){
                  if (response.orderConfirm){ //update product quantity & place order if all is correct and in stock
                     let updateQuery = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + product;
                     connection.query(updateQuery, function(err, res){
                        if (err) throw err;
                        console.log(
                           'Great! We have placed your order. Your total is $' + (productData.price * quantity) +
                           '\nThanks for shopping with us! Your order will arrive soon...'
                        );
                        //see if user wants to keep shopping
                        inquirer.prompt([
                           {
                              name: 'shopConfirm',
                              type: 'confirm',
                              message: 'Do you wish to keep shopping?'
                           }
                        ]).then(function(check){
                           if (check.shopConfirm){
                              openStore();
                           } else {
                              connection.end();
                           }
                        })
                     })
                  } 
                  else { //they messed up their order
                     console.log("Maybe you want to edit your order?");
                     promptPurchase(); 
                  } 
               })
            }           
            else { //if there's not enough in stock
               console.log("Sorry! We don't have enough of that item in stock. Please request a smaller amount.");
               promptPurchase();
            }
      })
   })
}
// launch program 
openStore();