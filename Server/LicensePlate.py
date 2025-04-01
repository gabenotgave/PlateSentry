from ultralytics import YOLO
import copy
import os

class LicensePlate:
    def __init__(self):
        # Load license plate object model
        model_path = os.path.join('.', 'lp_model.pt')
        self.model = YOLO(model_path) # Load a custom model
        #model.to('cuda')
    
    def get_bounding_box_coords(self, image):
        H, W, _ = image.shape

        # Confidence treshold for LP model (license plate recognition)
        lp_model_threshold = 0.5

        # Run model against image
        results = self.model.predict(image, imgsz=640, verbose=False)[0]

        x1, y1, x2, y2, score, class_id = result.boxes.data.tolist()[0]

        # LP model must be >50% confident
        if score > lp_model_threshold:
            return [x1, y1, x2, y2]
        
        return None