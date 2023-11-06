import { Model } from 'mongoose'
import slugify from 'slugify'

export const createUniqueSlug = async (model: Model<any>, name: string, oldSlug?: string) => {
  let slug = slugify(name, {
    replacement: '_',
    lower: true
  })

  if (oldSlug && slug === oldSlug) {
    return oldSlug
  }

  let count = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existingService = await model.findOne({ slug })
    if (!existingService) {
      return slug
    }
    slug = `${slug}_${count}`
    count++
  }
}
