const fs = require('fs');
const file = 'raw.txt'

/**
 * Function 1 - Read the file and returns it in JSON format.
 * @param {String} file Name with extension of the database file. Ex: 'raw.txt'
 */
function readFromFile(file) {
    try {
        var data = fs.readFileSync(file, 'utf-8');
    } catch (err) {
        console.log(err.message);
    }

    return JSON.parse(data);
};  

/**
 * Function 2 - Corrects the wrong caracters
 * @param {Array} data Array containing the JSON data.
 */
function fixData(data) {

    let dataString = JSON.stringify(data);

    charModel = {
        "æ" : 'a',
        "¢" : 'c',
        "ø" : 'o',
        "ß" : 'b'
    };

    let keyList = Object.keys(charModel);

    for (char of dataString) {        
         if (keyList.includes(char)) {
            dataString = dataString.replace(char, charModel[char]);
        };
    };

    Object.assign(data, JSON.parse(dataString));

    return data
};

/**
 * Function 3 - Fix the prices
 * @param {Array} data Array containing the JSON data.
 */
function fixPrices(data) {
    data.forEach(product => {
        if (!isNaN(product.price)) product.price = Number(product.price);
    });

    return data
};

/**
 * Function 4 - Fix the quantities
 * @param {Array} data Array containing the JSON data 
 */
function fixQuantities(data) {
    data.forEach(product => {
        product.quantity = !product.quantity ? 0 : product.quantity
    });

    return data
};

/**
 * Function 5 - Export the JSON file corrected data.
 * @param {Array} data Array containing the JSON data 
 * @param {String} fileName The name with extension of the output file. Ex: 'output.json'
 */
function exportDataToFile(data, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
};

//Validation Functions

/**
 * Ordering the product names by category and id.
 * @param {Array} data Array containing the JSON data
 */
function sortData(data) {

    console.log(`Product's names ordered by category and id: \n`);

    let sortedCategory = [];
    let sortedNames = [];

    //Generates the list containing all the categories.
    data.forEach(product => {
        let categoryName = product.category
        if (!sortedCategory.includes(categoryName)) sortedCategory.push(categoryName);
    });

    //Organize the sortedCategory list in alphabetical order.
    sortedCategory = sortedCategory.sort();

    //Filters the products by sortedCategory elements, find and sorts it's ids and finally print the products names.
    sortedCategory.forEach(categoryName => {
        let sortedId = [];
        let productsByCategory = data.filter(product => product.category === categoryName);

        productsByCategory.forEach(product => {
            sortedId.push(product.id);
        });

        //Sorting the ids
        sortedId.sort((a,b) => a - b);

        sortedId.forEach(idNumber => {
            let sortedProduct = productsByCategory.find(product => product.id === idNumber);
            sortedNames.push(sortedProduct.name);
            console.log(sortedProduct.name);
        });
    });

    return sortedNames
};

/**
 * Calculates the total stock value for each category.
 * @param {*} data Array containing the JSON data
 */
function stockValue(data) {

    let sortedCategory = [];
    let categoryValue = {};

    data.forEach(product => {
        let categoryName = product.category
        if (!sortedCategory.includes(categoryName)) sortedCategory.push(categoryName);
    });

    sortedCategory = sortedCategory.sort();

    sortedCategory.forEach(categoryName => {
        let productsByCategory = data.filter(product => product.category === categoryName);

        productsByCategory.forEach(product => {
            let quantity = product.quantity;
            let price = product.price;

            categoryValue[categoryName] = !categoryValue[categoryName] ? 0 : categoryValue[categoryName]      
            categoryValue[categoryName] += quantity*price;
        });        

        categoryValue[categoryName] = Number((categoryValue[categoryName]).toFixed(2));
    });

    console.log(`\n Total value in stock by category: \n`);
    console.log(JSON.stringify(categoryValue, null, 4));

    return categoryValue
}

/**
 * Executes the code, reading the file and running all fix and validation functions.
 */
function execute() {
    let data = readFromFile(file);
    fixData(data);
    fixPrices(data);
    fixQuantities(data);
    exportDataToFile(data, 'saida.json');
    
    sortData(data);
    stockValue(data);
}

execute();

exports.fixData = fixData;
exports.fixPrices = fixPrices;
exports.fixQuantities = fixQuantities;
exports.sortData = sortData;
exports.stockValue = stockValue;