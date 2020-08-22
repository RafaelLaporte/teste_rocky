const fs = require('fs');
const file = 'raw.txt'

//Function 1 - Read file
function readFromFile(file) {
    try {
        var data = fs.readFileSync(file, 'utf-8');
    } catch (err) {
        console.log(err.message);
    }

    return JSON.parse(data);
};

//Function 2 - Corrects the wrong caracters 
function fixData(data) {

    let dataString = JSON.stringify(data);

    charModel = {
        "æ" : 'a',
        "¢" : 'c',
        "ø" : 'o',
        "ß" : 'b'
    };
 
    for (char of dataString) {
        let keyList = Object.keys(charModel);
 
        if (keyList.includes(char)) {
            let regex = new RegExp(char, "g");
            dataString = dataString.replace(regex, charModel[char]);
        };
    };

    Object.assign(data, JSON.parse(dataString));
};

//Function 3 - Fix the prices
function fixPrices(data) {
    data.forEach(product => {
        if (!isNaN(product.price)) product.price = Number(product.price);
    });
};

//Function 4 - Fix the quantities
function fixQuantities(data) {
    data.forEach(product => {
        product.quantity = !product.quantity ? 0 : product.quantity
    });
};

//Function 5 - Export the JSON file corrected data.
function exportDataToFile(data, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
};

//Validation Functions
//Ordering the product names by category and id.
function sortData(file) {

    let sortedCategory = [];
    let sortedNames = [];

    file.forEach(product => {
        let categoryName = product.category
        if (!sortedCategory.includes(categoryName)) sortedCategory.push(categoryName);
    });

    sortedCategory = sortedCategory.sort();

    sortedCategory.forEach(categoryName => {

        let sortedId = [];
        let categoryList = file.filter(product => product.category === categoryName);

        categoryList.forEach(product => {
            sortedId.push(product.id);
        });

        sortedId.sort((a,b) => a - b);

        sortedId.forEach(idNumber => {
            let sortedProduct = categoryList.find(product => product.id === idNumber);
            sortedNames.push(sortedProduct.name);
        });
    });

    console.log(`Product's names ordered by category and id:`);
    console.log(sortedNames);
};

//Calculates the total stock value for each category.
function stockValue(file) {

    let sortedCategory = [];
    let categoryValue = {};

    file.forEach(product => {
        let categoryName = product.category
        if (!sortedCategory.includes(categoryName)) sortedCategory.push(categoryName);
    });

    sortedCategory = sortedCategory.sort();

    sortedCategory.forEach(categoryName => {
        let categoryProducts = file.filter(product => product.category === categoryName);

        categoryProducts.forEach(product => {
            let quantity = product.quantity;
            let price = product.price;

            //if (categoryValue[categoryName] == undefined) categoryValue[categoryName] = 0;
            categoryValue[categoryName] = !categoryValue[categoryName] ? 0 : categoryValue[categoryName]
       
            categoryValue[categoryName] += quantity*price;
        });        

        categoryValue[categoryName] = Number((categoryValue[categoryName]).toFixed(2));
    });

    console.log(`Total value in stock by category:`);
    console.log(categoryValue);
}

//Executes the code
let data = readFromFile(file);
fixData(data);
fixPrices(data);
fixQuantities(data);
exportDataToFile(data, 'saida.json');

sortData(data);
stockValue(data);