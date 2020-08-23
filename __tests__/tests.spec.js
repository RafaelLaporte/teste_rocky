const {fixData, fixPrices, fixQuantities, sortData, stockValue} = require('../resolucao');

describe("Fix data function test", () => {
    test("It should fix the corrupted chars.", () => {
        const input = [{
            id: 5677240,
            name: "Cønjuntø de Pænelæs æntiæderentes ¢øm 05 Peçæs Pæris",
            quantity: 21,
            price: "192.84",
            category: "Pænelæs"
          },
          {
            id: 9628920,
            name: "Lævæ & Se¢æ 10,2 Kg Sæmsung E¢ø ßußßle ßræn¢æ ¢øm 09 Prøgræmæs de Lævægem",
            price: 3719.70,
            category: "Eletrødømésti¢øs"
          },
          {
            id: 1911864,
            name: "Møuse Gæmer Predætør ¢estus 510 Føx Pretø",
            price: "699",
            category: "Acessóriøs"
          }];

          const output = [{
            id: 5677240,
            name: "Conjunto de Panelas antiaderentes com 05 Peças Paris",
            quantity: 21,
            price: "192.84",
            category: "Panelas"
          },
          {
            id: 9628920,
            name: "Lava & Seca 10,2 Kg Samsung Eco bubble branca com 09 Programas de Lavagem",
            price: 3719.70,
            category: "Eletrodomésticos"
          },
          {
            id: 1911864,
            name: "Mouse Gamer Predator cestus 510 Fox Preto",
            price: "699",
            category: "Acessórios"
          }];

        expect(fixData(input)).toEqual(output);
    });
});

describe("fixPrice function test", () => {
    test("It should change the type of the value of object.price to 'Number'.", () => {
            const input = [{
                id: 5677240,
                price: "192.84",
              },
              {
                id: 9628920,
                price: "3719.70",
              },
              {
                id: 1911864,
                price: "699",
              }];
    
              const output = [{
                id: 5677240,
                price: 192.84,
              },
              {
                id: 9628920,
                price: 3719.70,
              },
              {
                id: 1911864,
                price: 699,
              }];

              expect(fixPrices(input)).toEqual(output);
        });
});

describe("fixQuantity function test", () => {
    test("It should adds the property 'quantity' in the objects that doesn't have it, setting its value to 0.", () => {
            const input = [{
                id: 5677240,
                price: 192.84,
                quantity: 35
              },
              {
                id: 9628920,
                price: 3719.70,
              },
              {
                id: 1911864,
                price: 699,
              }];
    
              const output = [{
                id: 5677240,
                price: 192.84,
                quantity: 35
              },
              {
                id: 9628920,
                price: 3719.70,
                quantity: 0
              },
              {
                id: 1911864,
                price: 699,
                quantity: 0
              }];

              expect(fixQuantities(input)).toEqual(output);
        });
});

describe("sortData function test", () => {
    test("It should return the name of the products sorted by category and Id.", () => {
        const input = [{
            id: 5677240,
            name: "Conjunto de Panelas antiaderentes com 05 Peças Paris",
            quantity: 21,
            price: "192.84",
            category: "Panelas"
          },
          {
            id: 9628920,
            name: "Lava & Seca 10,2 Kg Samsung Eco bubble branca com 09 Programas de Lavagem",
            price: 3719.70,
            category: "Eletrodomésticos"
          },
          {
            id: 2162952,
            name: "Kit Gamer acer - Notebook + Headset + Mouse",
            price: 25599,
            category: "Eletrônicos",
            "quantity": 0
          },
          {
            id: 9576720,
            name: "Forno Micro-ondas Panasonic com capacidade de 21 Litros branco",
            quantity: 13,
            price: 358.77,
            category: "Eletrodomésticos"
          },
          {
            id: 1911864,
            name: "Mouse Gamer Predator cestus 510 Fox Preto",
            price: "699",
            category: "Acessórios"
          }];
    
        const output = [
            "Mouse Gamer Predator cestus 510 Fox Preto",
            "Forno Micro-ondas Panasonic com capacidade de 21 Litros branco",
            "Lava & Seca 10,2 Kg Samsung Eco bubble branca com 09 Programas de Lavagem",
            "Kit Gamer acer - Notebook + Headset + Mouse",
            "Conjunto de Panelas antiaderentes com 05 Peças Paris"
        ];

        expect(sortData(input)).toEqual(output);

    });
});

describe("stockValues function test", () => {
    test("It should generates an object containing the total value in stock for each category", () => {
            const input = [{
                id: 5677240,
                price: 192.84,
                quantity: 35,
                category: "Acessórios"
              },
              {
                id: 9628920,
                price: 3719.70,
                quantity: 5,
                category: "Acessórios"
              },
              {
                id: 1911864,
                price: 699,
                quantity: 0,
                category: "Eletrodomésticos"
              },
              {
                id: 9576720,
                quantity: 13,
                price: 358.77,
                category: "Eletrônicos"
              },
              {
                id: 5677240,
                quantity: 10,
                price: 192.84,
                category: "Panelas"
              }];
    
              const output = {
                  Acessórios: 25347.90,
                  Eletrodomésticos: 0.00,
                  Eletrônicos: 4664.01,
                  Panelas: 1928.40
              }

              expect(stockValue(input)).toEqual(output);
        });
});