import json
import sys

# Simple ML model for health ratings
# Since no real training data, we'll use a rule-based approach with dummy ML

def calculate_mental_rating(mental_data):
    # mental: stress, anxiety, isolation (lower better), focus, sleep, mood (higher better)
    # Invert the bad ones
    inverted_stress = 10 - (mental_data.get('stress') or 5)
    inverted_anxiety = 10 - (mental_data.get('anxiety') or 5)
    inverted_isolation = 10 - (mental_data.get('isolation') or 5)
    focus = mental_data.get('focus') or 5
    sleep = mental_data.get('sleep') or 5
    mood = mental_data.get('mood') or 5
    avg = (inverted_stress + inverted_anxiety + inverted_isolation + focus + sleep + mood) / 6
    return round(avg, 1)

def calculate_physical_rating(physical_data):
    # Physical: assume normal ranges
    # heartRate: 60-100 good
    hr = physical_data.get('heartRate') or 80
    hr_score = 10 - abs(hr - 80)/20 * 10  # closer to 80 better
    hr_score = max(1, min(10, hr_score))

    # BP: systolic 90-120, diastolic 60-80
    sys = physical_data.get('systolicBP') or 110
    dia = physical_data.get('diastolicBP') or 70
    bp_score = 10 - (abs(sys - 110)/30 + abs(dia - 70)/20) * 5
    bp_score = max(1, min(10, bp_score))

    # spo2: >95 good
    spo2 = physical_data.get('spo2') or 98
    spo2_score = min(10, spo2 / 10)

    # temperature: 36.5-37.5
    temp = physical_data.get('temperature') or 37
    temp_score = 10 - abs(temp - 37)/2 * 10
    temp_score = max(1, min(10, temp_score))

    # steps: more better, assume 5000-10000 good
    steps = physical_data.get('steps') or 7000
    steps_score = min(10, steps / 1000)

    avg = (hr_score + bp_score + spo2_score + temp_score + steps_score) / 5
    return round(avg, 1)

def analyze_health(data):
    # data is list of health logs
    if len(data) < 5:
        return {"error": "Need at least 5 entries"}

    # Take last 5
    recent = data[-5:]

    mental_ratings = []
    physical_ratings = []
    timestamps = []

    for entry in recent:
        mental = entry.get('mental') or {}
        physical = entry.get('physical') or {}
        mental_ratings.append(calculate_mental_rating(mental))
        physical_ratings.append(calculate_physical_rating(physical))
        timestamps.append(entry.get('timestamp', ''))

    overall_ratings = [(m + p) / 2 for m, p in zip(mental_ratings, physical_ratings)]

    return {
        "mental": mental_ratings,
        "physical": physical_ratings,
        "overall": overall_ratings,
        "timestamps": timestamps
    }

if __name__ == "__main__":
    # Read from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    result = analyze_health(data)
    print(json.dumps(result))