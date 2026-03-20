/**
 * 文章を指定した文数に短縮する
 * 日本語は「。！？」、英語は「.!?」で文を区切る
 */
export const truncateToSentences = (text, maxSentences = 2, lang = 'ja') => {
  if (!text) return ''
  const pattern = lang === 'ja'
    ? /[^。！？]+[。！？]/g
    : /[^.!?]+[.!?]+/g
  const sentences = text.match(pattern) || [text]
  return sentences.slice(0, maxSentences).join('')
}
