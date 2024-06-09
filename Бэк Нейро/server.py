from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from tensorflow import keras
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np

app = Flask(__name__)
CORS(app)

# Загрузка модели
model = keras.models.load_model('intrusion_detection_model.h5')

@app.route('/')
def index():
    return "Flask server is running!"

@app.route('/detect_anomalies', methods=['POST'])
def detect_anomalies():
    data = request.get_json()
    csv_data = pd.DataFrame(data)
    
    timestamps = csv_data['timestamp']
    csv_data = csv_data.drop(['timestamp'], axis=1)

    ip_columns = ['source_ip', 'destination_ip']
    protocol_column = 'protocol'

    ip_label_encoders = {col: LabelEncoder() for col in ip_columns}
    protocol_label_encoder = LabelEncoder()

    for col, encoder in ip_label_encoders.items():
        csv_data[col + '_encoded'] = encoder.fit_transform(csv_data[col])

    csv_data[protocol_column + '_encoded'] = protocol_label_encoder.fit_transform(csv_data[protocol_column])
    csv_data = csv_data.drop(ip_columns + [protocol_column], axis=1)

    model_input_columns = [
        'source_ip_encoded', 'destination_ip_encoded',
        'source_port', 'destination_port', 'protocol_encoded', 'packet_size'
    ]

    new_data_model_input = csv_data[model_input_columns]

    scaler = StandardScaler()
    new_data_normalized = scaler.fit_transform(new_data_model_input)

    predictions = model.predict(new_data_normalized)
    mse = np.mean(np.power(new_data_normalized - predictions, 2), axis=1)
    threshold = 0.025
    anomalies = (mse > threshold).astype(int)

    anomalies_data = pd.DataFrame({
        'timestamp': timestamps[anomalies == 1],
        'source_ip': ip_label_encoders['source_ip'].inverse_transform(csv_data.loc[anomalies == 1, 'source_ip_encoded']),
        'destination_ip': ip_label_encoders['destination_ip'].inverse_transform(csv_data.loc[anomalies == 1, 'destination_ip_encoded']),
        'source_port': csv_data.loc[anomalies == 1, 'source_port'],
        'destination_port': csv_data.loc[anomalies == 1, 'destination_port'],
        'protocol': protocol_label_encoder.inverse_transform(csv_data.loc[anomalies == 1, 'protocol_encoded']),
        'packet_size': csv_data.loc[anomalies == 1, 'packet_size'],
        'MSE': mse[anomalies == 1]
    })

    return anomalies_data.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
