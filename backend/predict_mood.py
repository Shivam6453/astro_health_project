import sys
import json
import base64
import os

import cv2
import numpy as np

# Try to import TensorFlow
try:
    from tensorflow.keras.models import load_model
    TF_AVAILABLE = True
except ImportError as e:
    TF_AVAILABLE = False
    tf_error = str(e)

# Load model once when the script is imported.
# The model lives in the workspace root under face-expression-recoganisation/.
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR.parent.joinpath("face-expression-recoganisation", "facialemotionmodel.h5").as_posix()

# Confidence threshold below which we treat predictions as neutral.
# If you want the model to be more decisive (less often neutral), lower this value.
MIN_CONFIDENCE = float(os.getenv("MOOD_MIN_CONFIDENCE", "0.20"))

labels = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# Load the model and face detector
if TF_AVAILABLE:
    try:
        model = load_model(MODEL_PATH)
    except Exception as e:
        model = None
        load_error = str(e)
else:
    model = None
    load_error = "TensorFlow not available: " + tf_error

haar_file = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(haar_file)

# Optional smile detector to improve happy detection
smile_file = cv2.data.haarcascades + "haarcascade_smile.xml"
smile_cascade = cv2.CascadeClassifier(smile_file)


def _predict_from_b64(b64_image):
    # Accept data URLs or raw base64 strings.
    if b64_image.startswith("data:"):
        b64_image = b64_image.split(",", 1)[1]

    try:
        img_bytes = base64.b64decode(b64_image)
    except Exception:
        return {"error": "Invalid base64 image"}

    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return {"error": "Could not decode image"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    print(f"DEBUG: Detected {len(faces)} faces", file=sys.stderr)

    if len(faces) == 0:
        # Some datasets / webcam crops may already contain a close-up face.
        # In that case, just resize the full image and proceed.
        face_roi = gray
        fallback = True
        print("DEBUG: No faces detected, using full frame", file=sys.stderr)
    else:
        x, y, w, h = faces[0]
        face_roi = gray[y : y + h, x : x + w]
        fallback = False
        print(f"DEBUG: Using face at ({x},{y}) size {w}x{h}", file=sys.stderr)

    # Heuristic: if a smile is visible in the face region, treat as happy.
    smile_detected = False
    if face_roi is not None and face_roi.size > 0:
        try:
          smiles = smile_cascade.detectMultiScale(face_roi, scaleFactor=1.7, minNeighbors=22)
          smile_detected = len(smiles) > 0
        except Exception:
          smile_detected = False

    if smile_detected:
        return {"label": "happy", "confidence": 0.95, "detail": "smile_override"}

    face = cv2.resize(face_roi, (48, 48))
    face = face.reshape(1, 48, 48, 1) / 255.0

    if model is None:
        # Return neutral when model is not available
        return {"label": "neutral", "confidence": 0.5, "detail": "Model not loaded: " + load_error}

    pred = model.predict(face, verbose=0)[0]
    idx = int(np.argmax(pred))
    confidence = float(pred[idx])

    print(f"DEBUG: Prediction - {labels[idx]} with confidence {confidence}", file=sys.stderr)

    # If model isn't confident, return neutral so the chatbot doesn't react strongly.
    if confidence < MIN_CONFIDENCE:
        print(f"DEBUG: Low confidence {confidence} < {MIN_CONFIDENCE}, returning neutral", file=sys.stderr)
        return {"label": "neutral", "confidence": confidence, "detail": "low_confidence"}

    result = {"label": labels[idx], "confidence": confidence}
    if fallback:
        result["detail"] = "no_face_detected_used_full_frame"
    return result


def main():
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print(json.dumps({"error": "Failed to parse JSON from stdin", "detail": str(e)}))
        sys.exit(1)

    image = data.get("image")
    if not image:
        print(json.dumps({"error": "Missing 'image' field"}))
        sys.exit(1)

    result = _predict_from_b64(image)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
