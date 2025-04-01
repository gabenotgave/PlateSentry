from paddleocr import PaddleOCR
import logging

class Text:
    def __init__(self):
        # Initialize PaddleOCR
        self.ocr = PaddleOCR(use_gpu=True, use_angle_cls=False, use_space_char=False, lang='en')  # Specify language(s) for OCR

        # Suppress PaddleOCR debug logs
        logging.getLogger('ppocr').setLevel(logging.ERROR)  # Only show ERROR and higher
    
    def recognize(self, image):
        # Perform OCR on the image
        ocr_results = self.ocr.ocr(image, cls=False)
        if ocr_results and ocr_results[0] is not None:
            text = ocr_results[0][0][1][0]  # Get the recognized text
            confidence = ocr_results[0][0][1][1]  # Get the confidence score

            # OCR model must be >90% confident
            if confidence > 0.9:

                return text
        
        return None