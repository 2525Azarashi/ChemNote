"""Checkpointed local regeneration. Outputs are candidates, never automatically approved."""
import argparse,hashlib,json,re,subprocess,time,os
from pathlib import Path
import numpy as np
import onnxruntime as ort
import soundfile as sf
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/'.tmpwork/kokoro'
p=argparse.ArgumentParser();p.add_argument('--limit',type=int,default=0);p.add_argument('--samples',action='store_true');args=p.parse_args()
model=BASE/'models/kokoro-v1.0.int8.onnx';voices=BASE/'models/voices-v1.0.bin'
hashfile=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
identity={'model':'Kokoro-82M v1.0 int8','license':'Apache-2.0','modelSha256':hashfile(model),'voicesSha256':hashfile(voices),'speed':.85,'kokoro_onnx':'0.6.1'}
jobs=json.loads((BASE/'jobs.json').read_text())
if args.samples:
 selected=[]
 for chapter in ['el1_A','el2','el3','el4_A','el4_B','el5','el6_A','el6_B']:
  selected.append(next(j for j in jobs if j['chapter']==chapter))
 jobs=selected
if args.limit:jobs=jobs[:args.limit]
options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
engine=Kokoro.from_session(ort.InferenceSession(str(model),sess_options=options,providers=['CPUExecutionProvider']),str(voices))
cache=BASE/'segments';cache.mkdir(exist_ok=True)
out=BASE/'replacement';out.mkdir(exist_ok=True)
for n,job in enumerate(jobs):
 started=time.time();dest=out/job['audioUrl'].lstrip('/');dest.parent.mkdir(parents=True,exist_ok=True);report=dest.with_suffix('.json')
 fingerprint=hashlib.sha256(json.dumps([identity,job],sort_keys=True).encode()).hexdigest()
 if report.exists() and dest.exists():
  prior=json.loads(report.read_text())
  if prior.get('fingerprint')==fingerprint and prior.get('sha256')==hashfile(dest):
   print(json.dumps({'event':'reused','id':job['id']}),flush=True);continue
 try:
  parts=[];sr=24000
  for turn in job['segments']:
   sentences=re.split(r'(?<=[.!?])\s+(?=[A-Z])|\n\s*\n',turn['text'].strip())
   for sentence in sentences:
    if not sentence.strip():continue
    key=hashlib.sha256(json.dumps([identity,sentence,turn['voice'],turn['lang']],sort_keys=True).encode()).hexdigest();cached=cache/(key+'.wav')
    if cached.exists():audio,sr=sf.read(cached,dtype='float32')
    else:
     audio,sr=engine.create(sentence,voice=turn['voice'],speed=identity['speed'],lang=turn['lang'])
     if len(audio)==0 or not np.isfinite(audio).all():raise ValueError('Invalid synthesis samples')
     sf.write(cached,audio,sr,subtype='FLOAT')
    parts.extend([audio,np.zeros(int(sr*.14),dtype=np.float32)])
   parts.append(np.zeros(int(sr*(.65 if job['chapter']=='el4_B' else .28)),dtype=np.float32))
  audio=np.concatenate(parts);peak=float(np.max(np.abs(audio)))
  if peak<.001:raise ValueError('Silent output')
  audio=audio*min(1,.92/peak)
  wav=dest.with_suffix('.working.wav');sf.write(wav,audio,sr,subtype='PCM_16')
  temp=dest.with_suffix('.working.mp3')
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','128k',str(temp)],check=True)
  os.replace(temp,dest);wav.unlink()
  seconds=len(audio)/sr;wpm=job['words']/seconds*60
  result={**identity,'id':job['id'],'audioUrl':job['audioUrl'],'sourceSha256':job['sourceSha256'],'fingerprint':fingerprint,'sha256':hashfile(dest),'seconds':round(seconds,3),'wordsPerMinute':round(wpm,1),'peak':round(float(np.max(np.abs(audio))),4),'speakerMap':{s['speaker']:s['voice'] for s in job['segments']},'notes':job['notes'],'status':'generated_needs_quality_review','script':'\n'.join(s['text'] for s in job['segments'])}
  report.write_text(json.dumps(result,ensure_ascii=False,indent=2))
  print(json.dumps({'event':'generated','n':n+1,'total':len(jobs),'id':job['id'],'seconds':round(seconds,1),'workSeconds':round(time.time()-started,1)},ensure_ascii=False),flush=True)
 except Exception as e:
  print(json.dumps({'event':'failed','id':job['id'],'error':str(e)},ensure_ascii=False),flush=True)
  raise
