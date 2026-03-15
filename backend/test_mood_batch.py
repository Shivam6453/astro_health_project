import cv2
import numpy as np
from pathlib import Path
from tensorflow.keras.models import load_model

# This script evaluates the mood model on a few sample images to check output consistency.

BASE = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE / "face-expression-recoganisation" / "facialemotionmodel.h5"

print("Using model:", MODEL_PATH)
model = load_model(str(MODEL_PATH))

labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

haar_file = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(haar_file)


def predict_for_image(img_path):
    img = cv2.imread(str(img_path))
    if img is None:
        return None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        face = cv2.resize(gray, (48, 48))
        fallback = True
    else:
        x, y, w, h = faces[0]
        face = gray[y : y + h, x : x + w]
        face = cv2.resize(face, (48, 48))
        fallback = False

    face = face.reshape(1, 48, 48, 1) / 255.0
    pred = model.predict(face, verbose=0)[0]
    idx = int(np.argmax(pred))
    confidence = float(pred[idx])
    return {
        "file": str(img_path.name),
        "label": labels[idx],
        "confidence": confidence,
        "fallback": fallback,
        "pred": pred.tolist(),
    }


# pick one image from each category
categories = ['happy', 'sad', 'fear', 'angry', 'neutral', 'surprise', 'disgust']

for cat in categories:
    folder = BASE / "face-expression-recoganisation" / "images" / "test" / cat
    if not folder.exists():
        continue
    files = sorted(folder.glob("*.jpg"))[:5]
    print(f"\n=== {cat} ({len(files)} samples) ===")
    for f in files:
        r = predict_for_image(f)
        if r is None:
            print(f"  {f.name}: failed to read")
            continue
        print(f"  {r['file']}: {r['label']} ({r['confidence']:.3f}) fallback={r['fallback']}")
