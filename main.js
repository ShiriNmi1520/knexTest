require('dotenv').config();
const knexConfig = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.databaseIP,
    port: process.env.databasePort,
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseName
  }
})
const mockDataPayment = require('./__MOCK__/mockDataPayment.json');
const mockDataTestTable = require('./__MOCK__/mockDataTestTable.json');

module.exports = {
  initDatabase: () => {
    return knexConfig.schema.hasTable('testTable').then((testTableExist) => {
      if (!testTableExist) {
        console.log('creating testTable...');
        knexConfig.schema.createTable('testTable', (table) => {
          table.increments('ID');
          table.string('description');
          table.timestamps();
        })
          .then(() => {
          })
          .catch(() => {
            console.error('error occurred while creating testTable.');
          })
      } else {
        console.log('testTable already exists, skipping...');
      }
      knexConfig.schema.hasTable('payment').then((paymentExist) => {
        if (!paymentExist) {
          console.log('creating payment table...');
          knexConfig.schema.createTable('payment', (table) => {
            table.increments('ID');
            table.integer('clientID').notNullable();
            table.float('price').notNullable();
            table.string('item').notNullable();
            table.integer('quantity').defaultTo(1);
            table.dateTime('createDate').defaultTo(knexConfig.fn.now());
          })
            .then(() => {
            })
            .catch(() => {
              console.error('error occurred while creating payment table.');
            })
        } else {
          console.log('payment table already exists, skipping...');
        }
      })
    })
      .finally(() => {
        knexConfig.destroy().then(() => {
          console.log('table create process done, connection closed.');
        })
      })
  },
  insertMockData: () => {
    knexConfig('testTable').insert(mockDataTestTable).catch(() => {
      console.error('error occurred on adding mock data to testTable');
    })
    knexConfig('payment').insert(mockDataPayment).catch(() => {
      console.error('error occurred on adding mock data to payment.');
    })
      .finally(() => {
        knexConfig.destroy().then(() => {
          console.log('adding mock data completed, connection closed.');
        })
      })
  },
}

module.exports.insertMockData();

knexConfig.schema.hasTable('testTable').then((exist) => {
  if (exist) {
    knexConfig('testTable').insert([{description: 'test'}, {description: 'test1'}, {description: 'test2'}])
  }
})

knexConfig.schema.alterTable('testTable', (table) => {
  table.dropColumn('created_at');
  table.dropColumn('updated_at');
})
