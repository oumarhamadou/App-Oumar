import sys, json, soundfile as sf, sherpa_onnx
m = sys.argv[1]; wav = sys.argv[2]; out = sys.argv[3]
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{m}/encoder.int8.onnx", decoder=f"{m}/decoder.int8.onnx",
    joiner=f"{m}/joiner.int8.onnx", tokens=f"{m}/tokens.txt",
    model_type="nemo_transducer", num_threads=4)
audio, sr = sf.read(wav, dtype="float32")
# chunk on ~10s windows aligned to silence is overkill; parakeet handles 35s fine
s = rec.create_stream(); s.accept_waveform(sr, audio); rec.decode_stream(s)
r = s.result
json.dump({"text": r.text, "tokens": list(r.tokens), "timestamps": list(r.timestamps),
           "durations": list(getattr(r, "durations", []) or [])}, open(out, "w"), ensure_ascii=False, indent=1)
print(r.text)
