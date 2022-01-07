import { Sequelize, Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'

const sequelize = new Sequelize(process.env.POSTGRES_CONNECTION, {
  dialect: 'postgres',
  logging: false
})

// console.log({sequelize, connection: process.env.POSTGRES_CONNECTION})

class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_token: {
      type: DataTypes.STRING
    },
    session_expiration: {
      type: DataTypes.DATEONLY
    }
  },
  {
    sequelize,
    modelName: 'user',
    tableName: 'next_bnb_users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
)

User.prototype.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password)
}

class House extends Sequelize.Model {}

House.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    picture: { type: Sequelize.DataTypes.STRING, allowNull: false },
    type: { type: Sequelize.DataTypes.STRING, allowNull: false },
    town: { type: Sequelize.DataTypes.STRING, allowNull: false },
    title: { type: Sequelize.DataTypes.STRING, allowNull: false },
    price: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    owner: { type: Sequelize.DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'house',
    tableName: 'next_bnb_houses',
    timestamps: false
  }
)

export { User, House, sequelize }
