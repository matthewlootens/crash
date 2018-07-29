from flask import Flask, send_from_directory, render_template

app = Flask(__name__)

@app.route('/')
def root():
    # return send_from_directory('.', 'index.html')
    return render_template('index.html')

@app.route('/map')
def display_map():
    return render_template('map.html')

# if __name__ == '__main__':
    # app.run(port = 5000)
