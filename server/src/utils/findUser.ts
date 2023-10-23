import User from 'src/models/userModel'

export const findUser = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId }).populate('customer').populate('admin')
    return user || null
  } catch (error) {
    return null
  }
}
