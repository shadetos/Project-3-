from api import make_recipe
from __init__ import create_app



app = create_app()

make_recipe()

if __name__ == '__main__':
    app.run(debug=True)
