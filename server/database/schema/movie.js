const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const db = 'mongodb://@localhost:27017/Vuetube'

const movieSchema = new Schema({
  doubanId: String,
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,

  tags: [String],

  meta: {
    createdAt: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }

})

movieSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Movie', movieSchema)
