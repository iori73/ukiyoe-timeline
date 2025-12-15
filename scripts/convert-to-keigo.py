#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSVファイル内の日本語テキストを敬語に変換するスクリプト
background_ja, themes_ja, market_ja, technique_jaの4つのカラムを対象
"""

import csv
import re
import sys

def convert_to_keigo(text):
    """日本語テキストを敬語に変換"""
    if not text:
        return text
    
    result = text
    
    # 文末の「。」で区切って各文を処理
    sentences = result.split('。')
    converted_sentences = []
    
    for sentence in sentences:
        if not sentence.strip():
            continue
        
        s = sentence.strip()
        
        # パターンマッチングによる変換
        # 〜した → 〜しました
        s = re.sub(r'確立した$', '確立しました', s)
        s = re.sub(r'始まった$', '始まりました', s)
        s = re.sub(r'実現した$', '実現しました', s)
        s = re.sub(r'展開した$', '展開しました', s)
        s = re.sub(r'展開。', '展開しました。', s)
        s = re.sub(r'移行した$', '移行しました', s)
        s = re.sub(r'移行。', '移行しました。', s)
        s = re.sub(r'一般化し、', '一般化し、', s)  # 途中の場合はそのまま
        s = re.sub(r'一般化した$', '一般化しました', s)
        s = re.sub(r'描けるようになった$', '描けるようになりました', s)
        s = re.sub(r'描けるようになった。', '描けるようになりました。', s)
        s = re.sub(r'増加した$', '増加しました', s)
        s = re.sub(r'増加。', '増加しました。', s)
        s = re.sub(r'確立し、', '確立し、', s)  # 途中の場合はそのまま
        s = re.sub(r'確立した$', '確立しました', s)
        s = re.sub(r'確立。', '確立しました。', s)
        s = re.sub(r'描いた$', '描きました', s)
        s = re.sub(r'描いた。', '描きました。', s)
        s = re.sub(r'表現した$', '表現しました', s)
        s = re.sub(r'表現。', '表現しました。', s)
        s = re.sub(r'創始し、', '創始し、', s)
        s = re.sub(r'創始した$', '創始しました', s)
        s = re.sub(r'追求した$', '追求しました', s)
        s = re.sub(r'追求した。', '追求しました。', s)
        s = re.sub(r'拡大し、', '拡大し、', s)
        s = re.sub(r'拡大した$', '拡大しました', s)
        s = re.sub(r'競合した$', '競合しました', s)
        s = re.sub(r'競合。', '競合しました。', s)
        s = re.sub(r'普及した$', '普及しました', s)
        s = re.sub(r'普及。', '普及しました。', s)
        s = re.sub(r'揃い、', '揃い、', s)
        s = re.sub(r'揃った$', '揃いました', s)
        s = re.sub(r'現れ始めた$', '現れ始めました', s)
        s = re.sub(r'現れ始めた。', '現れ始めました。', s)
        s = re.sub(r'繁盛し、', '繁盛し、', s)
        s = re.sub(r'繁盛した$', '繁盛しました', s)
        s = re.sub(r'できることもあった$', 'できることもありました', s)
        s = re.sub(r'できることもあった。', 'できることもありました。', s)
        s = re.sub(r'向上した$', '向上しました', s)
        s = re.sub(r'向上。', '向上しました。', s)
        s = re.sub(r'改善された$', '改善されました', s)
        s = re.sub(r'改善された。', '改善されました。', s)
        s = re.sub(r'誕生した$', '誕生しました', s)
        s = re.sub(r'誕生。', '誕生しました。', s)
        s = re.sub(r'盛んになり、', '盛んになり、', s)
        s = re.sub(r'盛んになった$', '盛んになりました', s)
        s = re.sub(r'求められた$', '求められました', s)
        s = re.sub(r'求められた。', '求められました。', s)
        s = re.sub(r'捉えた$', '捉えました', s)
        s = re.sub(r'捉えた。', '捉えました。', s)
        s = re.sub(r'風靡した$', '風靡しました', s)
        s = re.sub(r'風靡した。', '風靡しました。', s)
        s = re.sub(r'購入した$', '購入しました', s)
        s = re.sub(r'購入。', '購入しました。', s)
        s = re.sub(r'流通し、', '流通し、', s)
        s = re.sub(r'流通した$', '流通しました', s)
        s = re.sub(r'販売された$', '販売されました', s)
        s = re.sub(r'販売された。', '販売されました。', s)
        s = re.sub(r'認知されるようになった$', '認知されるようになりました', s)
        s = re.sub(r'認知されるようになった。', '認知されるようになりました。', s)
        s = re.sub(r'高まり続けた$', '高まり続けました', s)
        s = re.sub(r'高まり続けた。', '高まり続けました。', s)
        s = re.sub(r'始まった$', '始まりました', s)
        s = re.sub(r'始まった。', '始まりました。', s)
        s = re.sub(r'開発された$', '開発されました', s)
        s = re.sub(r'開発された。', '開発されました。', s)
        s = re.sub(r'好まれた$', '好まれました', s)
        s = re.sub(r'好まれた。', '好まれました。', s)
        s = re.sub(r'試みた$', '試みました', s)
        s = re.sub(r'試みた。', '試みました。', s)
        s = re.sub(r'広げた$', '広げました', s)
        s = re.sub(r'広げた。', '広げました。', s)
        s = re.sub(r'増えた$', '増えました', s)
        s = re.sub(r'増えた。', '増えました。', s)
        s = re.sub(r'施した$', '施しました', s)
        s = re.sub(r'施す。', '施しました。', s)
        s = re.sub(r'使用した$', '使用しました', s)
        s = re.sub(r'使用。', '使用しました。', s)
        s = re.sub(r'人気を博した$', '人気を博しました', s)
        s = re.sub(r'人気を博した。', '人気を博しました。', s)
        s = re.sub(r'強化されたが、', '強化されましたが、', s)
        s = re.sub(r'深化した$', '深化しました', s)
        s = re.sub(r'深化。', '深化しました。', s)
        s = re.sub(r'活躍し、', '活躍し、', s)
        s = re.sub(r'活躍した$', '活躍しました', s)
        s = re.sub(r'吹き込んだ$', '吹き込みました', s)
        s = re.sub(r'吹き込んだ。', '吹き込みました。', s)
        s = re.sub(r'焦点を当て、', '焦点を当て、', s)
        s = re.sub(r'焦点を当てた$', '焦点を当てました', s)
        s = re.sub(r'獲得した$', '獲得しました', s)
        s = re.sub(r'獲得。', '獲得しました。', s)
        s = re.sub(r'流出し始めた$', '流出し始めました', s)
        s = re.sub(r'流出し始めた。', '流出し始めました。', s)
        s = re.sub(r'発表した$', '発表しました', s)
        s = re.sub(r'発表。', '発表しました。', s)
        s = re.sub(r'制限された$', '制限されました', s)
        s = re.sub(r'制限された。', '制限されました。', s)
        s = re.sub(r'注がれた$', '注がれました', s)
        s = re.sub(r'注がれた。', '注がれました。', s)
        s = re.sub(r'強調した$', '強調しました', s)
        s = re.sub(r'強調。', '強調しました。', s)
        s = re.sub(r'追求された$', '追求されました', s)
        s = re.sub(r'追求された。', '追求されました。', s)
        s = re.sub(r'高まった$', '高まりました', s)
        s = re.sub(r'高まった。', '高まりました。', s)
        s = re.sub(r'急増した$', '急増しました', s)
        s = re.sub(r'急増した。', '急増しました。', s)
        s = re.sub(r'築いた$', '築きました', s)
        s = re.sub(r'築いた。', '築きました。', s)
        s = re.sub(r'果たした$', '果たしました', s)
        s = re.sub(r'果たした。', '果たしました。', s)
        s = re.sub(r'定着した$', '定着しました', s)
        s = re.sub(r'定着。', '定着しました。', s)
        s = re.sub(r'手がけた$', '手がけました', s)
        s = re.sub(r'手がけた。', '手がけました。', s)
        s = re.sub(r'登場した$', '登場しました', s)
        s = re.sub(r'登場。', '登場しました。', s)
        s = re.sub(r'可能になった$', '可能になりました', s)
        s = re.sub(r'可能になった。', '可能になりました。', s)
        s = re.sub(r'隆盛した$', '隆盛しました', s)
        s = re.sub(r'隆盛。', '隆盛しました。', s)
        s = re.sub(r'流行した$', '流行しました', s)
        s = re.sub(r'流行し、', '流行し、', s)
        s = re.sub(r'多様化した$', '多様化しました', s)
        s = re.sub(r'多様化。', '多様化しました。', s)
        s = re.sub(r'最大規模になった$', '最大規模になりました', s)
        s = re.sub(r'最大規模に。', '最大規模になりました。', s)
        s = re.sub(r'大ヒットした$', '大ヒットしました', s)
        s = re.sub(r'大ヒットし、', '大ヒットし、', s)
        s = re.sub(r'購入された$', '購入されました', s)
        s = re.sub(r'購入された。', '購入されました。', s)
        s = re.sub(r'変化した$', '変化しました', s)
        s = re.sub(r'変化。', '変化しました。', s)
        s = re.sub(r'本格化した$', '本格化しました', s)
        s = re.sub(r'本格化し、', '本格化し、', s)
        s = re.sub(r'源泉となった$', '源泉となりました', s)
        s = re.sub(r'源泉となった。', '源泉となりました。', s)
        s = re.sub(r'可能になった$', '可能になりました', s)
        s = re.sub(r'可能に。', '可能になりました。', s)
        s = re.sub(r'洗練された$', '洗練されました', s)
        s = re.sub(r'洗練され、', '洗練され、', s)
        s = re.sub(r'達した$', '達しました', s)
        s = re.sub(r'達し、', '達し、', s)
        s = re.sub(r'再現した$', '再現しました', s)
        s = re.sub(r'再現。', '再現しました。', s)
        s = re.sub(r'完成した$', '完成しました', s)
        s = re.sub(r'完成。', '完成しました。', s)
        s = re.sub(r'迎えた$', '迎えました', s)
        s = re.sub(r'迎えた。', '迎えました。', s)
        s = re.sub(r'得意とした$', '得意としました', s)
        s = re.sub(r'得意とし、', '得意とし、', s)
        s = re.sub(r'配置した$', '配置しました', s)
        s = re.sub(r'配置。', '配置しました。', s)
        s = re.sub(r'支持された$', '支持されました', s)
        s = re.sub(r'支持された。', '支持されました。', s)
        s = re.sub(r'整備した$', '整備しました', s)
        s = re.sub(r'整備し、', '整備し、', s)
        s = re.sub(r'成熟した$', '成熟しました', s)
        s = re.sub(r'成熟。', '成熟しました。', s)
        s = re.sub(r'取引されることもあった$', '取引されることもありました', s)
        s = re.sub(r'取引されることもあった。', '取引されることもありました。', s)
        s = re.sub(r'導入した$', '導入しました', s)
        s = re.sub(r'導入。', '導入しました。', s)
        s = re.sub(r'知られた$', '知られました', s)
        s = re.sub(r'知られ、', '知られ、', s)
        s = re.sub(r'購入できた$', '購入できました', s)
        s = re.sub(r'購入でき、', '購入でき、', s)
        s = re.sub(r'用意した$', '用意しました', s)
        s = re.sub(r'用意し、', '用意し、', s)
        s = re.sub(r'重ね摺りした$', '重ね摺りしました', s)
        s = re.sub(r'重ね摺りする。', '重ね摺りしました。', s)
        s = re.sub(r'可能になった$', '可能になりました', s)
        s = re.sub(r'可能になり、', '可能になり、', s)
        s = re.sub(r'爛熟した$', '爛熟しました', s)
        s = re.sub(r'爛熟し、', '爛熟し、', s)
        s = re.sub(r'成熟した$', '成熟しました', s)
        s = re.sub(r'成熟し、', '成熟し、', s)
        s = re.sub(r'向上した$', '向上しました', s)
        s = re.sub(r'向上し、', '向上し、', s)
        s = re.sub(r'実現できるようになった$', '実現できるようになりました', s)
        s = re.sub(r'実現できるようになった。', '実現できるようになりました。', s)
        s = re.sub(r'準備期間となった$', '準備期間となりました', s)
        s = re.sub(r'準備期間となった。', '準備期間となりました。', s)
        s = re.sub(r'見られた$', '見られました', s)
        s = re.sub(r'見られ、', '見られ、', s)
        s = re.sub(r'激化した$', '激化しました', s)
        s = re.sub(r'激化し、', '激化し、', s)
        s = re.sub(r'繰り広げられた$', '繰り広げられました', s)
        s = re.sub(r'繰り広げられた。', '繰り広げられました。', s)
        s = re.sub(r'重宝された$', '重宝されました', s)
        s = re.sub(r'重宝された。', '重宝されました。', s)
        s = re.sub(r'増加した$', '増加しました', s)
        s = re.sub(r'増加し、', '増加し、', s)
        s = re.sub(r'精緻になった$', '精緻になりました', s)
        s = re.sub(r'精緻になり、', '精緻になり、', s)
        s = re.sub(r'表現可能になった$', '表現可能になりました', s)
        s = re.sub(r'表現可能に。', '表現可能になりました。', s)
        s = re.sub(r'研究された$', '研究されました', s)
        s = re.sub(r'研究され、', '研究され、', s)
        s = re.sub(r'高まった$', '高まりました', s)
        s = re.sub(r'高まった。', '高まりました。', s)
        
        # 〜だった → 〜でした
        s = re.sub(r'特徴的だった$', '特徴的でした', s)
        s = re.sub(r'特徴的だった。', '特徴的でした。', s)
        s = re.sub(r'限定的だったが、', '限定的でしたが、', s)
        s = re.sub(r'中心だが、', '中心でしたが、', s)
        s = re.sub(r'主流だった$', '主流でした', s)
        s = re.sub(r'主流。', '主流でした。', s)
        s = re.sub(r'人気だった$', '人気でした', s)
        s = re.sub(r'人気。', '人気でした。', s)
        s = re.sub(r'高めだったが、', '高めでしたが、', s)
        s = re.sub(r'手が届く範囲だった$', '手が届く範囲でした', s)
        s = re.sub(r'手が届く範囲。', '手が届く範囲でした。', s)
        s = re.sub(r'特徴だった$', '特徴でした', s)
        s = re.sub(r'特徴。', '特徴でした。', s)
        s = re.sub(r'印象だった$', '印象でした', s)
        s = re.sub(r'印象。', '印象でした。', s)
        s = re.sub(r'中心だった$', '中心でした', s)
        s = re.sub(r'中心。', '中心でした。', s)
        
        converted_sentences.append(s)
    
    # 文を「。」で結合
    result = '。'.join(converted_sentences)
    if result and not result.endswith('。'):
        result += '。'
    
    return result

def process_csv(input_file, output_file):
    """CSVファイルを処理して敬語に変換"""
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # 対象カラム
    target_columns = ['background_ja', 'themes_ja', 'market_ja', 'technique_ja']
    
    # 各行を処理
    for row in rows:
        for col in target_columns:
            if col in row and row[col]:
                row[col] = convert_to_keigo(row[col])
    
    # 出力
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"処理完了: {input_file} → {output_file}")

if __name__ == '__main__':
    input_file = 'public/ukiyoe_for_figma_with_images_rows_duplicate_rows.csv'
    output_file = 'public/ukiyoe_for_figma_with_images_rows_duplicate_rows.csv'
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    process_csv(input_file, output_file)
