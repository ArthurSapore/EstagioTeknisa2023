const sequelize = require('sequelize');
const database = require('../db');

const programmerCpf = database.define('programmersCpf',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cpf:{
        type: sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = programmerCpf;