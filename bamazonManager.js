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

//use inquirer to display commands
const mgmtView = () => {
    inquirer.prompt([
        { //figure out what the manager wants to do
            type: 'list',
            name: 'manage',
            message: 'GREETINGS MANAGER. WHAT DO YOU WANT TO DO?',
            choices: [
                new inquirer.Separator(),
                'View All Products',
                new inquirer.Separator(),
                'View Low Inventory',
                new inquirer.Separator(),
                'Increase Inventory',
                new inquirer.Separator(),
                'Add New Product',
            ]
        }
    ]).then(response => {
        let action = response.manage ;
        //switch statement to evaluate user command
        switch (action) {
            case 'View All Products':
            viewProducts();
            break;
            case 'View Low Inventory':
            viewLowInv();
            break;
            case 'Increase Inventory':
            increaseInv();
            break;
            case 'Add New Product':
            addProduct();
            break;
            default:
            console.log('Strange things are afoot...')
        }
    });
}
//function to view all products
const viewProducts = () => {
    // display all available items in mySQL database
    connection.query('SELECT * FROM products', function(err, res) {
       if (err) throw err;
       console.log(
          '\nBAMAZON - MGMT VIEW\n' +
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
        mgmtView();

    })
}
//function to view products w inventory under 5
const viewLowInv = () => {
    //display products with inventory lower than 5
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, res) => {
        if (err) throw err;
        console.log(
            '\nBAMAZON - MGMT VIEW\n' +
            '--------------------------------\n' +
            'Items w/ Fewer than 5 Units:\n' +
            '--------------------------------\n'
        );
        for ( var i = 0  ; i < res.length ; i++ ) {
            //find low inventory items
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
        mgmtView();
    })
}
//function to increase product inventory
const increaseInv = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'prodID',
            message: 'What is the ID of the product you would like to edit?', 
        },
        {
            type: 'input',
            name: 'invQuant',
            message: 'How many units would you like to add?'
        }
    ]).then( input => {
        let productID = input.prodID;
        let amount = parseFloat(input.invQuant);
        let querySelect = 'SELECT * FROM products WHERE ?';
        connection.query(
            querySelect, {item_id: productID}, (err, data) => {
                let origAmount = parseFloat(data[0].stock_quantity);
                let queryUpdate = 'UPDATE products SET stock_quantity = '+ (origAmount + amount) + ' WHERE item_id = ' + productID;
                if (err) throw err;
                connection.query(
                    queryUpdate, (err, data) => {
                    if (err) throw err;
                    console.log("Success! Your inventory updates will reflect in the database.");
                    mgmtView();
                }
            )
        })
    })
}
//function to add new product
const addProduct = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'productName',
            message: 'What is the name of the product you are adding?'
        },
        {
            type: 'input',
            name: 'departmentName',
            message: 'In which department is the product?'
        },
        {
            type: 'input',
            name: 'stockQuant',
            message: 'How many units are you adding?'
        },
        {
            type: 'input',
            name: 'newPrice',
            message: 'How much will the customer pay per unit?'
        }
    ]).then(answers => {
        connection.query('INSERT INTO products SET ?', {
            product_name: answers.productName, 
            department_name: answers.departmentName, 
            stock_quantity: answers.stockQuant,
            price: answers.newPrice
        }, (err, res) => {
            if (err) throw err;
            console.log("Success! You've added a new product. Check the inventory to view your changes.")
            mgmtView();
        })
    })
}

mgmtView();
