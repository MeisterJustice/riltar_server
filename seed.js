const faker = require('faker');
const Product = require('./models/product');
const cryptoRandomString = require('crypto-random-string');


const randomCondition = [
    'brand new',
    'used',
    'refurbished',
]

exports.seed = async() => {
    await Product.deleteMany({});
    for(const i of new Array(600)) {
        const post = {
            title: faker.commerce.product(),
            description: faker.random.words(),
            brand: faker.commerce.product(),
            model: faker.commerce.productAdjective(),
            condition: randomCondition[Math.floor(Math.random()*randomCondition.length)],
            price: faker.commerce.price(),
            quantity: faker.random.number(),
            reference: `seed-${cryptoRandomString({ length: 11 })}`,
            tags: [faker.commerce.productAdjective(), faker.commerce.productAdjective(), faker.commerce.productMaterial(), faker.commerce.productMaterial(),],
            state: faker.address.state(),
            location: faker.address.secondaryAddress(),
            isPaused: faker.random.boolean()
        }
        await Product.create(post);
    }
    console.log('previous products deleted and 600 new ones added');
}