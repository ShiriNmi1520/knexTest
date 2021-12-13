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

knexConfig.schema.createTable('testTable', (table) => {
  table.increments('ID');
  table.string('description');
  table.timestamps();
})

knexConfig.schema.hasTable('testTable').then((exist) => {
  if (exist) {
    knexConfig('testTable').insert([{description: 'test'}, {description: 'test1'}, {description: 'test2'}])
      .then(() => {})
  }
})

knexConfig.schema.alterTable('testTable', (table) => {
  table.dropColumn('created_at');
  table.dropColumn('updated_at');
})

knexConfig('testTable').where('description', 'test')
  .then((result) => {
    result.map(data => {
      console.log(data);
    })
  })
