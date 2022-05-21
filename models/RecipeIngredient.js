const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class RecipeIngredient extends Model {}

RecipeIngredient.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    recipe_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'recipe',
            key: 'id'
        }
    },

    ingredient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ingredient',
            key: 'id'
        }
    },

    quantity: {
        type: DataTypes.INTEGER,

    },

    unit: {
        type: DataTypes.STRING,
    },

    images_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'images',
            key: 'id'
        }
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'recipe_ingredient',
});

module.exports = RecipeIngredient;