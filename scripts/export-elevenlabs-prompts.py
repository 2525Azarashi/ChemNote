#!/usr/bin/env python3
"""Export Eleven v3 emotion-tagged scripts and searchable PDF. Never generates audio."""
from pathlib import Path
import importlib.util
import json
import hashlib
import re
import zipfile
import fitz
from reportlab.platypus import PageBreak, KeepTogether
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
assert Path.cwd() == ROOT
spec = importlib.util.spec_from_file_location('pdf_helpers', ROOT/'scripts/build-listening-prompts-pdf.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
OUT = ROOT/'.delivery/elevenlabs-v3-roles-2026-09-19'
PDF = ROOT/'.delivery/manatobi_eleven_v3_speaker_labels_2026-09-19.pdf'
ZIP = ROOT/'.delivery/manatobi_eleven_v3_speaker_labels_2026-09-19.zip'
assert not any(p.exists() for p in [OUT, PDF, ZIP]), 'Use new output paths; never overwrite a delivery'
JOBS = h.JOBS
assert len(JOBS) == 364
p, en, heading = h.p, h.en, h.heading

def tag_for(text, tone):
    # Editorial suggestions only; never infer sadness, sarcasm, or correct answers.
    if 'thoughtful' in (tone or '').lower():
        return '[thoughtful]'
    if text.rstrip().endswith('?'):
        return '[curious]'
    return '[calm]'

def speaker_labels(job):
    """Scope numbered sex labels to one recording; preserve source facts separately."""
    counts = {'female': 0, 'male': 0}
    labels = {}
    plans = {v['speaker']: v for v in job['speakerPlan']}
    for segment in job['segments']:
        source = segment['speaker']
        if source in labels:
            continue
        plan = plans[source]
        sex = plan.get('sex') or plan['proposedDefault']['sex']
        assert sex in counts
        counts[sex] += 1
        labels[source] = {
            'label': ('女' if sex == 'female' else '男') + str(counts[sex]),
            'sex': sex,
            'provisional': not bool(plan.get('sex')),
        }
    assert len({v['label'] for v in labels.values()}) == len(labels)
    return labels

SETTINGS = {
 'displayModel': 'Eleven v3', 'model_id': 'eleven_v3',
 'stabilityUiMode': 'Natural', 'suggestedSpeed': 0.9,
 'speakerLabelScope': 'Per recording: 女1, 女2, 男1, 男2, numbered by first appearance within each sex. Unknown source sex uses an explicitly provisional editorial assignment.',
 'settingsStatus': 'starting_points_not_quality_approval',
 'voiceSelection': 'Use a licensed stock voice matching each source role/accent; voice IDs are not assigned.',
 'tagStatus': 'Editorial suggestions requiring listening review. [calm]/[thoughtful] are descriptive experimental tags; [curious] is an official example.',
 'commercialStatus': 'Generate new production audio during an eligible paid subscription; do not reuse Free-period recordings.',
 'promptingDocs': 'https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices#prompting-eleven-v3',
}
GUIDE = '''マナトビ ElevenLabs用 音声生成プロンプト
モデル名：Eleven v3
APIモデルID：eleven_v3
Stability：Natural（最初の推奨）。速度：0.9から試聴。画面に速度設定がなければ標準から開始。
モデルの公開IDは指定できますが、サーバー内部の重み/更新版を固定できる保証はありません。

入力方法：ElevenLabsのText to SpeechでEleven v3を選び、声を選択し、発話ごとの [タグ] と英文本体だけを貼る。
普通の丸括弧()ではなく角括弧[]を使う。話者ラベルや保存名、これらの説明は入力しない。
このタグ付き文をMultilingual v2、Flash/Turbo v2.5、別の最新モデルへ無断で流用しない。
Eleven v3はSSMLの<break>タグをサポートしない。句読点は原本のまま、発話間の間は結合時に調整。

[calm]：落ち着いた読みを狙う記述タグ。[thoughtful]：原本の話者説明がthoughtfulの場合だけ使う記述タグ。
[curious]：末尾が疑問符の発話へ一律に付けた穏やかな問いかけの初期案（公式例に掲載）。
calm/thoughtfulは公式の固定保証リストではなく、自由記述的なタグの試案。声によって無視・読み上げ・不自然な演技が出ることがある。
タグは正解や感情を原本から確定した証拠ではない。教材の根拠を変えないよう全件試聴が必要。
不自然なら先頭タグを外してNaturalで再生成。笑い、ため息、泣き声、効果音、強調大文字は自動追加しない。
Enhanceは自動使用しない。タグや強調が増えた場合、台本が変わっていないか確認。

セリフの話者表示は女1・女2・男1・男2。性別ごとの登場順で番号を付け、同じ音源内では固定する。
番号は音源ごとにリセットする。別音源の女1が同じ登場人物とは限らず、アクセント等の指定を優先する。
原本の性別が未指定の人は「仮」として制作上の割当を付ける。原本の事実として性別を確定したわけではない。
セリフ内に実際に出てくる人名は英文の一部なので削除しない。見出しにElevenLabsの声名を指定するものではない。
声の切替：女1の発話を生成→男1へ声を切替→女1の番では最初と同じ女性の声へ戻す。
同じ声名だけでなく可能ならvoice_idも記録。女1:と男1:を一つの欄へ貼るだけで別の声になるとは限らない。
今回は発話ごとの生成方式。Dialogue機能を使う場合は実画面で話者と声を対応づける。
声名/IDは未確定。原本の性別・役柄・アクセントを保持し、48音源の話者情報不足は要確認のまま。
元サンプルのAdelineは試聴候補であって、全役への一律指定ではない。

Stability：Creativeは演技が強くなりやすく追加音声等のリスクがあるので初期値にしない。
Naturalを基本にする。Robustは安定性を優先するが、タグへの反応が弱くなる。
音量と速度をそろえて否定、数値、固有名詞、先頭末尾切れ、話者、残響を確認。
短文→男女会話→4話者→長文の順に試してから全量へ。1ファイルは1回読み、2回読みはアプリ側。
タグ付き文字数は原台本より増える。消費クレジットは生成画面の実表示を確認する。

商用：ElevenLabsのStarter以上の有料契約が有効になってから本番を新規生成する。
公式FAQでは有料契約中生成の適法な音声は解約後も商用利用可能。無料時の音声が後の課金で商用化されるわけではない。
声や台本の権利・利用規約は別途遵守。APIキー、カード番号、個人住所を共有しない。
出典：https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform

返却：音源ごとのフォルダに001、002…の番号で音声を保存。結合できなければ分割のままで可。
モデルID、生成日時、実voice_id、設定、契約/権利の証跡参照、未完了箇所をメモしてZIPでこの部屋へ返す。
拡張子だけの変更は不可。長い録音を対戦55秒に合わせて切り詰めない。
本パックはプロンプトのみ。音声生成・課金・商用承認・アプリへの差し替えは行わない。
'''

def decorate(c, doc):
    w, height = A4
    c.setStrokeColor(h.TEAL); c.line(44,height-35,w-44,height-35)
    c.setFont('EN',8); c.setFillColor(h.TEAL)
    c.drawString(44,height-25,'MANATOBI / ELEVEN v3 / model_id: eleven_v3')
    c.drawString(44,24,'2026-09-19 | Suggested tags; review every recording')
    c.drawRightString(w-44,24,str(doc.page))

story = [heading('Eleven v3\n話者ラベル付き全台本', 'intro'),p('女1・女2・男1・男2でセリフを区別\n364音源・1,309発話','title')]
for section in GUIDE.strip().split('\n\n'):
    story.append(p(section))
story += [p('公式プロンプトガイド','h2'),p(SETTINGS['promptingDocs'],'small')]
manifest=[]; all_text=[]; text_files={}; current=None; total=0
for n,j in enumerate(JOBS,1):
    story.append(PageBreak())
    if current != j['chapterId']:
        current=j['chapterId'];story.append(heading(h.CHAPTERS[current],'chapter_'+current))
    story.append(heading(f"{n:03d} / 364  {j['label']} [{j['id']}]",'track_'+j['id'],1))
    story.append(p('モデル：Eleven v3 / eleven_v3 ／ Natural ／ 速度0.9を初期案','small'))
    story.append(p('完成ファイル：'+j['targetRelativePath'],'small'))
    if j['contextNotSpoken']:story.append(p('場面（読まない）：'+j['contextNotSpoken'],'small'))
    if j['sourceRoleReviewRequired']:story.append(p('要確認：原本の話者情報が不足。声の割当を確認してから生成。','note'))
    roles={v['speaker']:v for v in j['speakerPlan']}
    labels=speaker_labels(j)
    roster=[]
    for v in j['speakerPlan']:
        assignment=labels[v['speaker']]
        note='（仮：原本の性別未指定）' if assignment['provisional'] else ''
        description=f"{assignment['label']}{note}／{v['accent'] or 'アクセント未指定（米国英語は初期案）'}"
        roster.append(description)
        story.append(p(description,'small'))
    out_job={'id':j['id'],'chapterId':j['chapterId'],'problemId':j['problemId'],'targetRelativePath':j['targetRelativePath'],'model_id':'eleven_v3','sourceSha256':j['sourceSha256'],'speakerPlan':j['speakerPlan'],'sourceRoleReviewRequired':j['sourceRoleReviewRequired'],'qualityStatus':'pending','segments':[]}
    out_job['speakerLabels']=labels
    all_text.append(f"=== {j['id']} | {j['targetRelativePath']} ===\nModel: eleven_v3 | Natural | suggested speed 0.9\n話者指定（読まない）："+' / '.join(roster)+'\n')
    for seg in j['segments']:
        tag=tag_for(seg['text'],roles[seg['speaker']].get('tone'))
        prompt=tag+' '+seg['text']
        assert prompt[len(tag)+1:] == seg['text']
        path=f"texts/{j['chapterId']}/{Path(j['targetRelativePath']).stem}/{seg['index']:03d}.txt"
        text_files[path]=prompt
        display_label=labels[seg['speaker']]['label']
        out_job['segments'].append({**seg,'speakerLabel':display_label,'speakerLabelProvisional':labels[seg['speaker']]['provisional'],'audioTag':tag,'prompt':prompt,'promptFile':path,'voice_id':None,'reviewStatus':'pending'})
        story.append(KeepTogether([p(f"{display_label} ｜ セリフ {seg['index']:03d}（下の英文だけコピー）",'label'),en(prompt)]))
        story.append(p('保存番号：'+str(seg['index']).zfill(3)+' ／ 同じ話者では同じ声を選ぶ','small'))
        all_text.append(f"{display_label}【{seg['index']:03d}／この行は読まない】\n{prompt}\n")
        total+=1
    manifest.append(out_job)
assert total==1309
OUT.mkdir()
for name,text in text_files.items():
    dest=OUT/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text,encoding='utf-8')
(OUT/'00_READ_FIRST.txt').write_text(GUIDE,encoding='utf-8')
(OUT/'SETTINGS.json').write_text(json.dumps(SETTINGS,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'jobs_eleven_v3.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'ALL_PROMPTS.txt').write_text('\n'.join(all_text),encoding='utf-8')
doc=h.Document(str(PDF),pagesize=A4,leftMargin=46,rightMargin=46,topMargin=49,bottomMargin=44,title='マナトビ Eleven v3 女1・男1 話者ラベル付き台本',author='Manatobi production handoff',pageCompression=1)
doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
# Check PDF extraction independently of PDF generation.
pdf=fitz.open(PDF);full='\n'.join(page.get_text() for page in pdf)
norm=lambda x:re.sub(r'\s+','',x)
flat=norm(full)
assert all(j['id'] in full for j in manifest)
assert all(norm(s['prompt']) in flat for j in manifest for s in j['segments'])
for job in manifest:
    assert len(set(v['label'] for v in job['speakerLabels'].values())) == len(job['speakerLabels'])
    for segment in job['segments']:
        assert segment['speakerLabel'] == job['speakerLabels'][segment['speaker']]['label']
        assert re.fullmatch(r'[男女][1-9][0-9]*', segment['speakerLabel'])
        assert norm(f"{segment['speakerLabel']} ｜ セリフ {segment['index']:03d}") in flat
assert '\ufffd' not in full
for page in pdf:
    for block in page.get_text('blocks'):
        assert block[0]>=0 and block[1]>=0 and block[2]<=page.rect.width+1 and block[3]<=page.rect.height+1
status={'tracks':len(manifest),'turns':total,'pdfPages':len(pdf),'sourceTextPreserved':True,'allTaggedPromptsFoundInPDF':True,'commercialReleaseApproved':False,'generatedAudioCount':0,'taggedCharacters':sum(len(t) for t in text_files.values()),'pdfSha256':hashlib.sha256(PDF.read_bytes()).hexdigest()}
(OUT/'VALIDATION.json').write_text(json.dumps(status,indent=2),encoding='utf-8')
files=sorted(x for x in OUT.rglob('*') if x.is_file())
(OUT/'FILES.sha256').write_text('\n'.join(hashlib.sha256(f.read_bytes()).hexdigest()+'  '+str(f.relative_to(OUT)) for f in files)+'\n')
with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(OUT.rglob('*')):
        if f.is_file():z.write(f,OUT.name+'/'+str(f.relative_to(OUT)))
with zipfile.ZipFile(ZIP) as z:assert z.testzip() is None
print(json.dumps(status,indent=2))
print(PDF);print(ZIP)
