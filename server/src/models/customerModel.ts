import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomer extends mongoose.Document {}

const customerSchema: mongoose.Schema = new mongoose.Schema<ICustomer>({})

const Customer: mongoose.Model<ICustomer> = mongoose.model<ICustomer>('customer', customerSchema)
export default Customer
