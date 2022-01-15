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

class Booking extends Sequelize.Model {}

Booking.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    houseId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    userId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
    startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
    paid: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    sessionId: { type: Sequelize.DataTypes.STRING }
  },
  {
    sequelize,
    modelName: 'booking',
    tableName: 'next_bnb_bookings',
    timestamps: true
  }
)

User.sync() //{ alter: true }
Booking.sync()
House.sync()
/* (async function addItems() {
  await House.create({
    picture: '/img/1.jpeg',
    type: 'Entire house',
    town: 'New York',
    title: 'Beautiful flat in New York!',
    price: 150,
    owner: 1,
  })
  await House.create({
    picture: '/img/2.jpeg',
    type: 'Entire house',
    town: 'Amsterdam',
    title: 'A flat in Amsterdam with a great view',
    price: 90,
    owner: 1,
  })
})() */

export { User, House, Booking, sequelize }
