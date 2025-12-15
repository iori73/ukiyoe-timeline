import Papa from 'papaparse'

export async function loadUkiyoeData() {
  // 🔍 DEMO: データ読み込みを強制的に遅延（ローディング画面表示用）
  // ネットワークリクエストを遅延
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const response = await fetch('/ukiyoe_for_figma_with_images_rows_duplicate_rows.csv')
  const csvText = await response.text()
  
  // パース処理も遅延
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Sort by year_start
        const sortedData = results.data.sort((a, b) => 
          parseInt(a.year_start) - parseInt(b.year_start)
        )
        resolve(sortedData)
      },
      error: (error) => reject(error)
    })
  })
}

// Helper to get localized field
export function getLocalizedField(item, fieldBase, lang) {
  const suffix = lang === 'ja' ? '_ja' : '_en'
  return item[fieldBase + suffix] || item[fieldBase + '_en'] || ''
}

