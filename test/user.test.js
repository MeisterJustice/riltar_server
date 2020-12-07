const mongoose = require('mongoose');
const User = require('../models/user');
const faker = require('faker');
const {connectDb} = require('./db')

describe('User Model Test', () => {
    var user_id;

    // It's just so easy to connect to the MongoDB Memory Server 
    // By using mongoose.connect
    beforeAll(async () => {
        connectDb("mongodb://localhost:27017/jest");
    });

    afterAll(async() => {
        await User.collection.drop();
    })

    it('create & save user successfully', async () => {
        const userData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            password: faker.internet.password()
        };
        const user = await User.create(userData);
        expect(user._id).toBeDefined();
        expect(user.firstName).toBe(userData.firstName);
        expect(user.lastName).toBe(userData.lastName);
        expect(user.username).toBe(userData.username)
        expect(user.email).toBe(userData.email)
        expect(user.phone).toBe(userData.phone);
        expect(user.password).toBeDefined();
    });

    it('create & save user successfully but ignores unwanted field', async () => {
        const userData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            password: faker.internet.password(),
            anything: faker.name.findName()
        };
        const user = await User.create(userData);
        expect(user._id).toBeDefined();
        expect(user.firstName).toBe(userData.firstName);
        expect(user.lastName).toBe(userData.lastName);
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.phone).toBe(userData.phone);
        expect(user.password).toBeDefined();
        expect(user.anything).toBeUndefined();
    });

    it('fails if required fields is undefined', async () => {
        const userData = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(),
            anything: faker.name.findName()
        };
        let err;
        try {
            const user = await User.create(userData);
            error = user
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
        expect(err.errors.phone).toBeDefined();
        expect(err.errors.username).toBeDefined();
    });

    it('finds all users', async () => {
        let users = await User.find({}).sort({'email': 1});
        user_id = users[0].id;
        expect(users.length).toBeGreaterThan(0)
    });

    it('finds user by id', async () => {
        let user = await User.findById(user_id);
        expect(user).toBeDefined()
    });

    it('updates a user', async () => {
        let user = await User.findById(user_id)
        user.firstName = 'justice';
        user.lastName = 'eziefule';
        user.email = 'justice@gmail.com';
        user.phone = '08130813765';
        user.department = 'statistics';
        user.faculty = 'school of physical sciences';
        user.location.country = 'England';
        user.location.state = 'Manchester';
        user.location.city = 'Manchester';
        user.location.address = '50b Alex Ferguson Way'

        await user.save();
        user_id = user.id;
        expect(user._id).toBeDefined();
        expect(user.firstName).toBe('justice');
        expect(user.lastName).toBe('eziefule');
        expect(user.department).toBe('statistics');
        expect(user.faculty).toBe('school of physical sciences');
        expect(user.email).toBe('justice@gmail.com');
        expect(user.phone).toBe('08130813765');
        expect(user.location.country).toBe('England');
        expect(user.location.state).toBe('Manchester');
        expect(user.location.city).toBe('Manchester');
        expect(user.location.address).toBe('50b Alex Ferguson Way');
    });

    it('update user bank details', async () => {
        const data = {
            bankName: 'First Bank',
            bankCode: faker.finance.currencyCode(),
            bankAccountNumber: faker.finance.account(),
        }
        const user = await User.findById(user_id);
        user.bankAccountNumber = data.bankAccountNumber;
        user.bankCode = data.bankCode;
        user.bankName = data.bankName;
        await user.save()
        expect(user.bankName).toBe(data.bankName);
        expect(user.bankCode).toBe(data.bankCode);
        expect(user.bankAccountNumber).toBe(data.bankAccountNumber);
    });

    it('update user business documents', async () => {
        const data = {
            identificationImageUrl: faker.image.image(),
            businessDocumentImageUrl: faker.image.image(),
        }
        const user = await User.findById(user_id);
        user.identification.imageUrl = data.identificationImageUrl;
        user.businessDocument.imageUrl = data.businessDocumentImageUrl;
        await user.save()
        expect(user.businessDocument.imageUrl).toBe(data.businessDocumentImageUrl);
        expect(user.identification.imageUrl).toBe(data.identificationImageUrl);
    });

    it('soft removes user', async () => {
        let user = await User.findById(user_id);
        user.isDeleted.delete = true;
        await user.save();
        expect(user.isDeleted.delete).toBe(true);
    });

    it('suspends user', async () => {
        let data = {
            from : faker.date.recent(),
            to: faker.date.future()
        }
        let user = await User.findById(user_id);
        user.isSuspended.suspend = true;
        user.isSuspended.from = data.from;
        user.isSuspended.to = data.to;
        await user.save();
        expect(user.isSuspended.suspend).toBe(true);
        expect(user.isSuspended.from).toBe(data.from);
        expect(user.isSuspended.to).toBe(data.to);
        expect(user.isSuspended.to > user.isSuspended.from).toBeTruthy();
    });
    
})