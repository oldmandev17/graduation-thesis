import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAdmin extends mongoose.Document {}

const adminSchema: mongoose.Schema = new mongoose.Schema<IAdmin>({})

const Admin: mongoose.Model<IAdmin> = mongoose.model<IAdmin>('admin', adminSchema)
export default Admin
