const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const faker = require('faker');
const { connectDb } = require('./db')

const userData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password()
};
const adminData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password(),
    isAdmin: true
};

describe('User Model Test', () => {
    var user_id;
    var admin_id;
    var product_id;
    var category_id;
    var subcategory_id;

    // It's just so easy to connect to the MongoDB Memory Server 
    // By using mongoose.connect
    beforeAll(async () => {
        await connectDb("mongodb://localhost:27017/jest");
        const user = await User.create(userData);
        user_id = user.id;
        const admin = await User.create(adminData);
        admin_id = admin.id;
        const category = await Category.create({ title: 'electronics' });
        category_id = category.id;
        let subcategory = await Subcategory.create({
            title: 'phone',
            description: 'any description',
            category: category_id,
        });
        subcategory_id = subcategory.id;
    });

    afterAll(async () => {
        await User.collection.drop();
        await Product.collection.drop();
        await Subcategory.collection.drop();
        await Category.collection.drop();
        
    })


    it('create & save product successfully', async () => {
        const productData = {
            title: faker.commerce.product(),
            description: faker.lorem.sentences(),
            brand: faker.commerce.productAdjective(),
            model: faker.commerce.productAdjective(),
            condition: 'used',
            secondCondition: 'cracked',
            price: parseInt(faker.commerce.price()),
            quantity: 50,
            state: 'rivers state',
            location: 'agip',
            user: user_id,
            metaData: [
                { make: faker.commerce.productAdjective(), },
                { company: faker.commerce.productAdjective(), },
                { battery: faker.commerce.productAdjective(), }
            ],
            subcategory: subcategory_id,
        };
        const product = await Product.create(productData);
        expect(product._id).toBeDefined();
        expect(product.title).toBe(productData.title);
        expect(product.description).toBe(productData.description);
        expect(product.brand).toBe(productData.brand);
        expect(product.model).toBe(productData.model);
        expect(product.condition).toBe(productData.condition);
        expect(product.secondCondition).toBe(productData.secondCondition);
        expect(product.price).toBe(productData.price);
        expect(product.quantity).toBe(productData.quantity);
        expect(product.state).toBe(productData.state);
        expect(product.location).toBe(productData.location);
        expect(product.isNegotiable).toBe(false);
        expect(product.metaData.length > 0).toBeTruthy();
        expect(product.user).toBeDefined()
    });

    it('gets all products', async () => {
        const product = await Product.find({})
        product_id = product[0].id;
        expect(product.length).toBeDefined();
        expect(product[0]._id).toBeDefined();
        expect(product[0].title).toBeDefined();
    });

    it('gets a product', async () => {
        const product = await Product.findById(product_id)
            .populate('user')
            .populate({
                path: 'subcategory',
                populate: ({
                    path: 'category'
                })
            })
            .exec();
        const subcategory = await Subcategory.findById(product.subcategory._id);
        subcategory.numberOfVisits += 1;
        await subcategory.save();
        const category = await Category.findById(product.subcategory.category._id);
        category.numberOfVisits += 1;
        await category.save();
        const user = await User.findById(user_id);
        user.viewedProducts.push(product.id);
        await user.save()

        expect(product._id).toBeDefined();
        expect(product.title).toBeDefined();
        expect(product.user._id).toBeDefined();
        expect(product.user.firstName).toBe(user.firstName);
        expect(subcategory.numberOfVisits === 1).toBeTruthy();
        expect(category.numberOfVisits === 1).toBeTruthy();
        expect(user.viewedProducts.length === 1).toBeTruthy();
    });

    it('updates product images and tags', async () => {
        const product = await Product.findById(product_id)
        const urls = [
            'any url',
            'any url',
            'any url',
            'any url',
        ]
        const tag1 = 'smart phone';
        const tag2 = 'infinix';
        const tag3 = 'infinix smart phone';
        const tag4 = 'flat';

        if (tag1) product.tags.push(tag1);
        if (tag2) product.tags.push(tag2);
        if (tag3) product.tags.push(tag3);
        if (tag4) product.tags.push(tag4);
        product.isFinishedEditing = true;

        await urls.forEach((url) => {
            product.image.imageUrls.push(url);
        })

        await product.save();

        expect(product._id).toBeDefined();
        expect(product.tags.length === 4).toBeTruthy();
        expect(product.tags[0]).toBe(tag1);
        expect(product.image.imageUrls.length === 4).toBeTruthy();
        expect(product.isFinishedEditing).toBe(true);
    });

    it('updates product', async () => {
        let product = await Product.findByIdAndUpdate(product_id, {
            quantity: 23,
            price: 4000,
            description: 'anything'
        }, { new: true });

        expect(product._id).toBeDefined();
        expect(product.quantity === 23).toBeTruthy();
        expect(product.price).toBe(4000);
    });

    it('soft deletes product', async () => {
        let user = await User.findById(user_id);
        let product = await Product.findByIdAndUpdate(product_id, {
            isDeleted: true
        }, {new: true});
        user.products.remove(product.id);
        await user.save();

        expect(product._id).toBeDefined();
        expect(product.isDeleted).toBeTruthy();
        expect(user.products.length).toBe(0);
    });

})