// db.js
const mysql = require('mysql2');

function getDbConnection(callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root', // Se você tem uma senha, descomente e adicione
        database: 'test' // Conecta diretamente ao banco de dados do projeto
    });

    connection.connect(function(err) {
        if (err) {
            console.error('Erro na conexão com o banco de dados:', err.stack);
            return callback(err); // Retorna o erro para o callback
        }
        console.log('Conexão ao test estabelecida. ID:', connection.threadId);
        callback(null, connection); // Retorna null para erro e a conexão
    });
}

module.exports = { getDbConnection };