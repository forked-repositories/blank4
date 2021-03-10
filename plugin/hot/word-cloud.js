const boa = require('@pipcook/boa')
const path = require('path')
const os = require('os')
const Segment = require('segment')

const { WordCloud } = boa.import('wordcloud')
const font_path = path.join(__dirname, 'FZLTHJW.TTF')
const segment = new Segment()
segment.useDefault()

function createWordCloud(text) {
  const wordList = segment.doSegment(text, {
    stripPunctuation: true
  })
  const wc = new WordCloud(
    boa.kwargs({
      font_path,
      width: 1000,
      height: 1000,
      margin: 2,
      max_font_size: 100,
      background_color: 'white',
      collocations: false
    })
  )
  wc.generate(
    wordList
      .map(item => item.w)
      .join(',')
      .replace(/\[CQ:[^]]*?\]/gim, '')
  )
  const filename = path.join(
    os.tmpdir(),
    `go-cqhttp-node-hot-${Date.now()}.png`
  )
  wc.to_file(filename)
  // console.log(filename)
  return `file://${filename}`
}

module.exports = {
  createWordCloud
}
