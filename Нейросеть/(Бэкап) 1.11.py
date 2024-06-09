import tkinter as tk
from tkinter import filedialog
import pandas as pd
from tensorflow import keras
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Загрузка модели
model = keras.models.load_model('intrusion_detection_model.h5')

# Создание главного окна
root = tk.Tk()
root.title("Аномалии в сетевом трафике")

# Задание размеров окна пользователя
root.geometry("1400x1000")

# Изменение цвета фона
bg_color = "#FBE5C8"
root.configure(bg=bg_color)

# Глобальные переменные для хранения холста и текстового виджета
canvas_widget = None
text_widget = None

# Функция для обнаружения аномалий на новых данных
def detect_anomalies():
    # Удаляем предыдущий холст и текстовый виджет
    clear_output()

    # Открываем диалоговое окно для выбора файла с новыми данными
    file_path = filedialog.askopenfilename(title="Выберите файл с данными", filetypes=[("CSV files", "*.csv")])

    if file_path:
        # Загружаем новые данные
        new_data = pd.read_csv(file_path)

        # Сохранение 'timestamp' для последующего использования
        timestamps = new_data['timestamp']

        # Удаление 'timestamp' и 'label'
        new_data = new_data.drop(['timestamp', 'label'], axis=1, errors='ignore')  # Используем errors='ignore' для игнорирования отсутствующих столбцов

        # Выделение категориальных столбцов
        ip_columns = ['source_ip', 'destination_ip']
        protocol_column = 'protocol'

        # Создание LabelEncoders для каждого категориального столбца
        ip_label_encoders = {col: LabelEncoder() for col in ip_columns}
        protocol_label_encoder = LabelEncoder()

        # Обучение и трансформация категориальных столбцов
        for col, encoder in ip_label_encoders.items():
            new_data[col + '_encoded'] = encoder.fit_transform(new_data[col])

        new_data[protocol_column + '_encoded'] = protocol_label_encoder.fit_transform(new_data[protocol_column])

        # Удаление исходных категориальных столбцов
        new_data = new_data.drop(ip_columns + [protocol_column], axis=1, errors='ignore')  # Используем errors='ignore' для игнорирования отсутствующих столбцов

        # Выбор соответствующих столбцов для ввода в модель
        # Выбор соответствующих столбцов для ввода в модель
        # Выбор соответствующих столбцов для ввода в модель
        model_input_columns = new_data.columns.tolist()[:-1]  # все столбцы кроме последнего (anomaly)



        # Извлечение выбранных столбцов
        new_data_model_input = new_data[model_input_columns]

        # Создание StandardScaler и обучение на данных
        scaler = StandardScaler()
        new_data_normalized = scaler.fit_transform(new_data_model_input)

        # Расчет среднеквадратичной ошибки (MSE) между входными данными и предсказаниями
        predictions = model.predict(new_data_normalized)
        mse = np.mean(np.power(new_data_normalized - predictions, 2), axis=1)

        # Порог для обнаружения аномалий
        threshold = 0.7

        # Обнаружение аномалий
        anomalies = (mse > threshold).astype(int)

        # Запись аномалий в файл
        anomalies_data = pd.DataFrame({
            'timestamp': timestamps[anomalies == 1],
            'source_ip': ip_label_encoders['source_ip'].inverse_transform(new_data['source_ip_encoded'][anomalies == 1]),
            'destination_ip': ip_label_encoders['destination_ip'].inverse_transform(new_data['destination_ip_encoded'][anomalies == 1]),
            'packet_size': new_data['packet_size'][anomalies == 1],
            'protocol': protocol_label_encoder.inverse_transform(new_data['protocol_encoded'][anomalies == 1]),
            'MSE': mse[anomalies == 1]
        })
        anomalies_data.to_csv('anomaly_detection.log', index=False, float_format='%.6f')  # Указание формата для чисел с плавающей запятой

        # Визуализация результатов в окне Tkinter
        fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(12, 6), facecolor=bg_color)
        axes[0].plot(mse, label='MSE')
        axes[0].set_xlabel('Индекс примера')
        axes[0].set_ylabel('MSE')
        axes[0].axhline(threshold, color='red', linestyle='--', label='Порог')
        axes[0].legend()

        scatter = axes[1].scatter(range(len(mse)), mse, c=anomalies, cmap='coolwarm', s=50)
        axes[1].set_xlabel('Индекс примера')
        axes[1].set_ylabel('MSE')
        fig.colorbar(scatter, ax=axes[1])  # Используем fig.colorbar вместо colorbar
        axes[1].axhline(threshold, color='red', linestyle='--')

        # Встраивание графика в Tkinter окно
        global canvas_widget
        canvas_widget = FigureCanvasTkAgg(fig, master=root)
        canvas_widget.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)

        # Отображение данных в текстовом виджете
        display_anomalies_data(anomalies_data)

# Функция для отображения данных в текстовом виджете
def display_anomalies_data(data):
    global text_widget
    if text_widget is None:
        text_widget = tk.Text(root, height=10, width=80, bg="white", wrap=tk.WORD)
        text_widget.pack(side=tk.TOP, pady=20, padx=20, anchor=tk.CENTER)  # Выравнивание по центру и уменьшение ширины

    text_widget.delete(1.0, tk.END)  # Очистка текстового виджета

    # Запись данных в текстовый виджет
    text_widget.insert(tk.END, data.to_string(index=False))

# Функция для очистки вывода (удаление холста и текстового виджета)
def clear_output():
    global canvas_widget, text_widget
    if canvas_widget:
        canvas_widget.get_tk_widget().destroy()
        canvas_widget = None
    if text_widget:
        text_widget.destroy()
        text_widget = None

# Кнопка для обнаружения аномалий
detect_button = tk.Button(root, text="Обнаружить аномалии", command=detect_anomalies)
detect_button.pack(pady=20)

# Запуск Tkinter цикла событий
root.mainloop()
