import axios from 'axios'

export const translateObject = async (language: string, object: string): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: process.env.OPENAI_MODEL,
        prompt: `Tôi bảo là chỉ dịch nội dung trong dấu nháy đôi sau dấu hai chấm sang tiếng ${
          language === 'vi' ? 'Anh' : 'Việt'
        }, nhưng giữ lại cấu trúc của json: "${object}"`,
        max_tokens: 100 // Số lượng tokens tối đa cho kết quả dịch
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    )
    const translatedText = response.data.choices[0].text

    return translatedText
  } catch (error) {
    console.log('🚀 ~ file: translateObject.ts:24 ~ translateText ~ error:', error)
  }
}
