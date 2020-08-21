const fs = require('fs');
const file = 'raw.txt'


//Executes the code
let data = dataReader(file);
data = correctNames(data);
correctPrices(data);
correctQuantities(data);

const correctedFile = correctData(data);
const correctedData = dataReader(correctedFile);

sortData(correctedData);
stockValue(correctedData);

//Function 1 - Read file
function dataReader(file) {
    try {
        var data = fs.readFileSync(file, 'utf-8');
    } catch (err) {
        console.log(err.message);
    }

    return JSON.parse(data);
};

//Function 2 - Corrects the wrong caracters 
function correctNames(data) {

    dataString = JSON.stringify(data);

    correctChars = {
        "æ" : 'a',
        "¢" : 'c',
        "ø" : 'o',
        "ß" : 'b'
    };
 
    for (letter of dataString) {
        let keyList = Object.keys(correctChars);
 
        if (keyList.includes(letter)) {
            let regex = new RegExp(letter, "g");
            var dataString = dataString.replace(regex, correctChars[letter]);
        };
    };

    return JSON.parse(dataString);
};

//Function 3 - Corrects the prices
function correctPrices(data) {
    data.forEach(product => {
        if (!isNaN(product.price)) product.price = Number(product.price);
    });
    //console.log(data);
};

//Function 4 - Correct quantities
function correctQuantities(data) {
    data.forEach(product => {
        if (product.quantity == undefined) product.quantity = 0;
    })
    //console.log(data);
};

//Function 5 - Export the JSON file corrected data.
function correctData(data) {
    let fileName = 'saida.json';
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));

    return fileName
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

            if (categoryValue[categoryName] == undefined) categoryValue[categoryName] = 0;
       
            categoryValue[categoryName] += quantity*price;
        });        

        categoryValue[categoryName] = Number((categoryValue[categoryName]).toFixed(2));
    });

    console.log(`Total value in stock by category:`);
    console.log(categoryValue);
}