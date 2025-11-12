# water-quality-prediction-dl-project
A deep learning project focused on predicting water quality using data from the Central Pollution Control Board (CPCB). The project includes both regression and classification tasks to forecast the Water Quality Index (WQI) and categorize water quality (e.g., Good, Poor, Unsuitable for Drinking). The model incorporates advanced preprocessing.
---------------

# Water Quality Prediction with Deep Learning  

## Overview  
Access to clean water is a fundamental human necessity, and understanding water quality is critical for ensuring public health and environmental sustainability. This project uses deep learning techniques to predict water quality based on data from the **Central Pollution Control Board (CPCB), India**.  

The dataset includes chemical and physical water parameters, enabling predictions for:  
1. **Water Quality Index (WQI)** (Regression Task).  
2. **Water Quality Classification** (Classification Task).  

---  

## Features  

### **Data Preprocessing**  
- Imputed missing values using strategies based on geographical clusters.  
- Standardized numeric features with **MinMaxScaler** to optimize gradient descent.  
- Encoded categorical features using **OrdinalEncoder** for seamless processing.  

### **Feature Engineering**  
- Removed highly correlated features to mitigate multicollinearity issues.  
- Identified features with strong predictive capabilities for model input.  

### **Model Architecture**  
- Designed multi-task learning with two deep learning models:  
  - **Regression Model**: Predicts the continuous WQI.  
  - **Classification Model**: Categorizes water quality into five levels (e.g., Good, Poor).  
- Integrated the following techniques:  
  - **Batch Normalization** for faster convergence.  
  - **Dropout Regularization** to combat overfitting.  
  - **Leaky ReLU** activation for better gradient flow.  

### **Regularization and Optimization**  
- Utilized **Dropout**, **Batch Normalization**, and **L2 Regularization** for enhanced generalization.  
- Fine-tuned hyperparameters like dropout rates, learning rates, and hidden layers using **Optuna**.  

### **Evaluation Metrics**  
- **Regression Task**:  
  - **Mean Absolute Error (MAE)**: Measures prediction accuracy.  
  - **R² Score**: Assesses variance explained by the model.  
- **Classification Task**:  
  - **Accuracy**: Overall prediction correctness.  
  - **F1-Score**: Balances precision and recall.  

---  

## Skills and Technologies Used  
- **Deep Learning Frameworks**: PyTorch  
- **Data Manipulation**: Pandas, NumPy  
- **Visualization**: Matplotlib, Seaborn  
- **Hyperparameter Tuning**: Optuna  
- **Evaluation Metrics**: sklearn  

---  

## How to Use  

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/GovindaTak/water-quality-prediction-dl.git  
   cd water-quality-prediction-dl  
   ```  

2. **Install Dependencies**:  
   ```bash
   pip install -r requirements.txt  
   ```  

3. **Run the Jupyter Notebook**:  
   ```bash
   jupyter notebook Water_Quality_Prediction.ipynb  
   ```  

4. **Results and Insights**:  
   - Evaluate the model using provided metrics.  
   - Visualize loss curves and predictions.  

---

## Results  

### **Regression Task**  
- **MAE**: 74.94  
- **R² Score**: 0.62  

### **Classification Task**  
- **Accuracy**: 71.5%  
- **F1-Score**: 0.71  

---

## Key Insights  
- **Regularization**: Techniques like Dropout and Batch Normalization significantly improved model performance.  
- **Feature Impact**: Parameters like **Electrical Conductivity** and **Chlorides** showed strong correlations with water quality.  
- **Hyperparameter Tuning**: Optuna played a critical role in optimizing convergence and improving performance.  

---

## Future Enhancements  
1. Incorporate additional water quality parameters for enhanced predictions.  
2. Extend the model to predict regional water quality trends.  
3. Explore ensemble learning techniques for superior performance.  

---

## License  
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

- 
