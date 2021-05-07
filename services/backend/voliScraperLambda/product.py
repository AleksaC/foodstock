import json

class Product:
    def __init__(self):
      pass

    def add_attribute(self, id, value):
        if id == 0:
            self.energy = value
        
        elif id == 1:
            self.fats = float(value)

        elif id == 2:
            self.saturated_fats = float(value)

        elif id == 3:
            self.proteins = float(value)

        elif id == 4:
            self.carbs = float(value)
        
        elif id == 5:
            self.sugar = float(value)
        
        elif id == 6:
            self.fiber = float(value)

        elif id == 7:
            self.salt = float(value)

    def to_json(self):
        return json.dumps(self.__dict__)